import { Request, Response } from 'express'
import { id, userId } from './fixtures'

export const createRequest = (overrides: Partial<Request> = {}): Request => ({
  params: { id }, body: {}, headers: {}, userId, ...overrides,
} as Request)

export const createResponse = (): Response => {
  const response = { status: jest.fn(), json: jest.fn(), send: jest.fn() } as unknown as Response
  jest.mocked(response.status).mockReturnValue(response)
  jest.mocked(response.json).mockReturnValue(response)
  jest.mocked(response.send).mockReturnValue(response)
  return response
}
