import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { login } from './login'
import { getUserByEmail } from '../repositories/users/get-user-by-email'
import { user } from '../__test-support__/fixtures'

jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../repositories/users/get-user-by-email')

const getUserByEmailMocked = jest.mocked(getUserByEmail)
const compareMocked = jest.mocked(bcrypt.compare)
const signMocked = jest.mocked(jwt.sign)
const credentials = { email: user.email, password: 'password123' }

beforeEach(() => {
  jest.resetAllMocks()
  jest.replaceProperty(process, 'env', { ...process.env, JWT_SECRET: 'test-secret' })
  getUserByEmailMocked.mockResolvedValue(user)
  compareMocked.mockImplementation(async () => true)
  signMocked.mockImplementation(() => 'signed-token')
})

describe('login', () => {
  it('checks the password and signs a token with the user id', async () => {
    await expect(login(credentials)).resolves.toEqual({ token: 'signed-token' })
    expect(getUserByEmailMocked).toHaveBeenCalledWith(credentials.email)
    expect(compareMocked).toHaveBeenCalledWith(credentials.password, user.passwordHash)
    expect(signMocked).toHaveBeenCalledWith({}, 'test-secret', { subject: user.id, expiresIn: '1h' })
  })

  it('rejects an unknown user without checking a password', async () => {
    getUserByEmailMocked.mockResolvedValue(null)
    await expect(login(credentials)).rejects.toThrow('Invalid email or password')
    expect(compareMocked).not.toHaveBeenCalled()
    expect(signMocked).not.toHaveBeenCalled()
  })

  it('rejects an incorrect password without issuing a token', async () => {
    compareMocked.mockImplementation(async () => false)
    await expect(login(credentials)).rejects.toThrow('Invalid email or password')
    expect(signMocked).not.toHaveBeenCalled()
  })

  it('rejects a missing JWT secret', async () => {
    delete process.env.JWT_SECRET
    await expect(login(credentials)).rejects.toThrow('JWT secret is not configured')
    expect(signMocked).not.toHaveBeenCalled()
  })

  it.each(['repository', 'password', 'token'])('propagates a failure in %s', async (step) => {
    const error = new Error('Dependency failed')
    if (step === 'repository') getUserByEmailMocked.mockRejectedValue(error)
    if (step === 'password') compareMocked.mockImplementation(async () => { throw error })
    if (step === 'token') signMocked.mockImplementation(() => { throw error })
    await expect(login(credentials)).rejects.toBe(error)
  })
})
