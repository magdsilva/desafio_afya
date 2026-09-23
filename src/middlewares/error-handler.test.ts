import { errorHandler } from './error-handler'
import { createRequest, createResponse } from '../__test-support__/http'

describe('Middleware - error-handler', () => {
  it('logs the error and returns a generic 500 response', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorMocked = jest.mocked(console.error)
    const error = new Error('Sensitive database details')
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())

    errorHandler(error, createRequest({ requestId: 'request-123' }), response, nextMocked)

    expect(JSON.parse(errorMocked.mock.calls[0][0])).toMatchObject({
      event: 'request.failed', level: 'error', request_id: 'request-123',
      error: { name: 'Error', message: error.message, stack: error.stack },
    })
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({ message: 'Internal server error' })
    expect(nextMocked).not.toHaveBeenCalled()
  })

  it('delegates errors when the response headers have already been sent', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const response = createResponse()
    response.headersSent = true
    const next = jest.fn()
    const error = new Error('Stream failed')
    errorHandler(error, createRequest(), response, next)
    expect(next).toHaveBeenCalledWith(error)
    expect(response.json).not.toHaveBeenCalled()
  })
})
