import { NextFunction, Request, Response } from 'express'
import { asyncHandler } from './async-handler'
import { createRequest, createResponse } from '../__test-support__/http'

describe('asyncHandler', () => {
  it('forwards the request, response and next to the handler', async () => {
    const handler = jest.fn<Promise<unknown>, [Request, Response, NextFunction]>()
    const handlerMocked = jest.mocked(handler)
    handlerMocked.mockResolvedValue('done')
    const request = createRequest()
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())

    asyncHandler(handler)(request, response, nextMocked)
    await Promise.resolve()

    expect(handlerMocked).toHaveBeenCalledWith(request, response, nextMocked)
    expect(nextMocked).not.toHaveBeenCalled()
  })

  it('forwards a rejected promise to the error middleware', async () => {
    const error = new Error('Handler failed')
    const handler = jest.fn<Promise<unknown>, [Request, Response, NextFunction]>()
    const handlerMocked = jest.mocked(handler)
    handlerMocked.mockRejectedValue(error)
    const nextMocked = jest.mocked(jest.fn())

    asyncHandler(handler)(createRequest(), createResponse(), nextMocked)
    await Promise.resolve()

    expect(nextMocked).toHaveBeenCalledTimes(1)
    expect(nextMocked).toHaveBeenCalledWith(error)
  })
})
