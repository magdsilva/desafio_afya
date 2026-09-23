import jwt from 'jsonwebtoken'
import { auth } from './auth'
import { createRequest, createResponse } from '../__test-support__/http'
import { userId } from '../__test-support__/fixtures'

jest.mock('jsonwebtoken')
const verifyMocked = jest.mocked(jwt.verify)

beforeEach(() => {
  jest.resetAllMocks()
  jest.replaceProperty(process, 'env', { ...process.env, JWT_SECRET: 'test-secret' })
  verifyMocked.mockImplementation(() => ({ sub: userId }))
})

describe('Middleware - auth', () => {
  it('sets the authenticated user and calls next', () => {
    const request = createRequest({ headers: { authorization: 'Bearer token' }, userId: undefined })
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())
    auth(request, response, nextMocked)
    expect(verifyMocked).toHaveBeenCalledWith('token', 'test-secret')
    expect(request.userId).toBe(userId)
    expect(nextMocked).toHaveBeenCalledTimes(1)
    expect(nextMocked).toHaveBeenCalledWith()
    expect(response.status).not.toHaveBeenCalled()
  })

  it.each([
    [undefined, 'Token not provided'],
    ['', 'Token not provided'],
    ['Basic token', 'Invalid token'],
    ['Bearer', 'Invalid token'],
    ['Bearer ', 'Invalid token'],
    ['bearer token', 'Invalid token'],
  ])('rejects authorization header %j', (authorization, message) => {
    const request = createRequest({ headers: { authorization }, userId: undefined })
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())
    auth(request, response, nextMocked)
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ message })
    expect(verifyMocked).not.toHaveBeenCalled()
    expect(nextMocked).not.toHaveBeenCalled()
    expect(request.userId).toBeUndefined()
  })

  it('returns 500 when the JWT secret is missing', () => {
    delete process.env.JWT_SECRET
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())
    auth(createRequest({ headers: { authorization: 'Bearer token' } }), response, nextMocked)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({ message: 'JWT secret is not configured' })
    expect(verifyMocked).not.toHaveBeenCalled()
    expect(nextMocked).not.toHaveBeenCalled()
  })

  it.each(['invalid signature', 'jwt expired'])('rejects a token when verification fails: %s', (message) => {
    verifyMocked.mockImplementation(() => { throw new Error(message) })
    const request = createRequest({ headers: { authorization: 'Bearer token' }, userId: undefined })
    const response = createResponse()
    const nextMocked = jest.mocked(jest.fn())
    auth(request, response, nextMocked)
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid token' })
    expect(nextMocked).not.toHaveBeenCalled()
    expect(request.userId).toBeUndefined()
  })
})
