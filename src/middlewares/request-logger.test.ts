import { EventEmitter } from 'node:events'
import { Response } from 'express'
import { createRequest } from '../__test-support__/http'
import { logger } from '../config/logger'
import { requestLogger } from './request-logger'

const createResponse = (statusCode = 200): Response => Object.assign(new EventEmitter(), {
  statusCode, setHeader: jest.fn(), writableFinished: false,
}) as unknown as Response

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Middleware - request-logger', () => {
  it('returns a generated ID and logs completion once without query, body or authorization', () => {
    const request = createRequest({ method: 'POST', url: '/patients?secret=hidden',
      path: '/patients', body: { password: 'hidden' }, headers: { authorization: 'Bearer hidden' } })
    const response = createResponse(201)
    const next = jest.fn()
    requestLogger(request, response, next)
    expect(request.requestId).toMatch(/^[0-9a-f-]{36}$/)
    expect(response.setHeader).toHaveBeenCalledWith('X-Request-Id', request.requestId)
    expect(next).toHaveBeenCalledTimes(1)
    response.emit('finish')
    response.emit('close')
    const calls = jest.mocked(console.log).mock.calls
    expect(calls).toHaveLength(2)
    expect(JSON.parse(calls[0][0])).toMatchObject({ event: 'request.started', request_id: request.requestId })
    expect(JSON.parse(calls[1][0])).toMatchObject({ event: 'request.completed',
      request_id: request.requestId, method: 'POST', path: '/patients', status_code: 201,
      duration_ms: expect.any(Number) })
    expect(JSON.stringify(calls)).not.toContain('hidden')
  })

  it.each(['', 'invalid id', 'a'.repeat(129), ['multiple', 'values']])('replaces invalid incoming ID %p', (value) => {
    const request = createRequest({ headers: { 'x-request-id': value } })
    requestLogger(request, createResponse(), jest.fn())
    expect(request.requestId).toMatch(/^[0-9a-f-]{36}$/)
  })

  it.each([400, 401, 404, 500])('logs HTTP %s at the appropriate level', (status) => {
    const response = createResponse(status)
    requestLogger(createRequest(), response, jest.fn())
    response.emit('finish')
    const output = status >= 500 ? console.error : console.warn
    expect(JSON.parse(jest.mocked(output).mock.calls[0][0])).toMatchObject({
      event: 'request.completed', status_code: status, level: status >= 500 ? 'error' : 'warn',
    })
  })

  it('logs an interrupted response only once', () => {
    const response = createResponse()
    requestLogger(createRequest(), response, jest.fn())
    response.emit('close')
    response.emit('finish')
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(JSON.parse(jest.mocked(console.warn).mock.calls[0][0])).toMatchObject({ event: 'request.aborted' })
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it('keeps IDs isolated across concurrent asynchronous operations', async () => {
    await Promise.all(['first', 'second'].map((requestId) => new Promise<void>((resolve) => {
      requestLogger(createRequest({ headers: { 'x-request-id': requestId } }), createResponse(), () => {
        setImmediate(() => {
          logger.info('operation.completed', { operation: requestId })
          resolve()
        })
      })
    })))
    const entries = jest.mocked(console.log).mock.calls.map(([entry]) => JSON.parse(entry))
    expect(entries.filter(entry => entry.event === 'operation.completed')).toEqual([
      expect.objectContaining({ request_id: 'first', operation: 'first' }),
      expect.objectContaining({ request_id: 'second', operation: 'second' }),
    ])
    logger.info('outside.request')
    expect(JSON.parse(jest.mocked(console.log).mock.calls.at(-1)![0])).not.toHaveProperty('request_id')
  })
})
