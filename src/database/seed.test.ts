import bcrypt from 'bcrypt'
import { database } from '../config/database'
import { DatabaseQuery } from '../__test-support__/database'

jest.mock('dotenv/config', () => ({}))
jest.mock('bcrypt')
jest.mock('../config/database', () => ({ database: { query: jest.fn(), end: jest.fn() } }))

const hashMocked = jest.mocked(bcrypt.hash)
const queryMocked = jest.mocked(database.query as DatabaseQuery)
const endMocked = jest.mocked(database.end as () => Promise<void>)

const runSeed = async () => {
  jest.isolateModules(() => { require('./seed') })
  // All I/O is mocked: let the script's promise chain finish before assertions.
  await new Promise<void>((resolve) => setImmediate(resolve))
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.replaceProperty(process, 'env', {
    ...process.env, SEED_USER_NAME: 'Doctor', SEED_USER_EMAIL: 'doctor@example.com', SEED_USER_PASSWORD: 'password123',
  })
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(process, 'exit').mockImplementation(() => undefined as never)
  hashMocked.mockImplementation(async () => 'hashed-password')
  queryMocked.mockResolvedValue({ rows: [{ id: 'user-id' }], rowCount: 1 })
  endMocked.mockResolvedValue(undefined)
})

describe('Database - seed', () => {
  it('hashes the password, inserts the user and closes the pool', async () => {
    await runSeed()
    expect(hashMocked).toHaveBeenCalledWith('password123', 10)
    expect(queryMocked).toHaveBeenCalledWith(expect.stringContaining('ON CONFLICT (email) DO NOTHING'), ['Doctor', 'doctor@example.com', 'hashed-password'])
    expect(jest.mocked(console.log)).toHaveBeenCalledWith('Seed user created successfully')
    expect(endMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(process.exit)).not.toHaveBeenCalled()
  })

  it('handles an existing user and still closes the pool', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await runSeed()
    expect(jest.mocked(console.log)).toHaveBeenCalledWith('Seed user already exists')
    expect(jest.mocked(console.log)).not.toHaveBeenCalledWith('Seed user created successfully')
    expect(endMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(process.exit)).not.toHaveBeenCalled()
  })

  it.each(['SEED_USER_NAME', 'SEED_USER_EMAIL', 'SEED_USER_PASSWORD'])('rejects missing %s before hashing or querying', async (key) => {
    delete process.env[key]
    await runSeed()
    expect(hashMocked).not.toHaveBeenCalled()
    expect(queryMocked).not.toHaveBeenCalled()
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Seed failed:', expect.objectContaining({ message: 'Seed user environment variables are missing' }))
    expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1)
  })

  it('logs a hashing failure without inserting a user', async () => {
    const error = new Error('Hash failed')
    hashMocked.mockImplementation(async () => { throw error })
    await runSeed()
    expect(queryMocked).not.toHaveBeenCalled()
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Seed failed:', error)
    expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1)
  })

  it('closes the pool and exits with a failure when insertion fails', async () => {
    const error = new Error('Insert failed')
    queryMocked.mockRejectedValue(error)
    await runSeed()
    expect(endMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Seed failed:', error)
    expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1)
  })
})
