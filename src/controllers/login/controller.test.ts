import { loginController } from './controller'
import { login } from '../../use-cases/login'
import { validate } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../__test-support__/http'
import { user } from '../../__test-support__/fixtures'

jest.mock('../../use-cases/login')
jest.mock('./validate')

const loginMocked = jest.mocked(login)
const validateMocked = jest.mocked(validate)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = { email: user.email, password: "password123" }

beforeEach(() => {
  jest.resetAllMocks()
  loginMocked.mockResolvedValue({ token: "token" })
  validateMocked.mockReturnValue({ value, error: undefined })
})

describe('loginController', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: { raw: 'input' } })
    const response = createResponse()
    await expect(loginController(request, response)).resolves.toBe(response)
    expect(loginMocked).toHaveBeenCalledTimes(1)
    expect(loginMocked).toHaveBeenCalledWith({ email: value.email, password: value.password })
    expect(validateMocked).toHaveBeenCalledWith(request.body)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ token: "token" })
  })

  it('returns the validation message without calling the use case', async () => {
    validateMocked.mockReturnValue({ value: {}, error: validationError })
    const response = createResponse()
    await loginController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' })
    expect(loginMocked).not.toHaveBeenCalled()
  })

  it('returns 401 when authentication fails', async () => {
    loginMocked.mockRejectedValue(new Error('Invalid credentials'))
    const response = createResponse()
    await loginController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid email or password' })
  })
})
