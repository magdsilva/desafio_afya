import { errorHandler } from './error-handler'
import { createRequest, createResponse } from '../__test-support__/http'

describe('errorHandler', () => {
  it('logs the error and returns a generic 500 response', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorMocked = jest.mocked(console.error)
    const error = new Error('Sensitive database details')
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())

    errorHandler(error, createRequest(), response, nextMocked)

    expect(errorMocked).toHaveBeenCalledWith(error)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({ message: 'Internal server error' })
    expect(nextMocked).not.toHaveBeenCalled()
  })
})
