import { Pool, PoolClient } from 'pg'
import { database, connectDatabase } from './database'

jest.mock('pg', () => ({
  Pool: jest.fn(() => ({ on: jest.fn(), connect: jest.fn() })),
}))

const PoolMocked = jest.mocked(Pool)
const connectMocked = jest.mocked(database.connect as () => Promise<PoolClient>)

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  connectMocked.mockReset()
})

describe('Config - database', () => {
  it('configures the pool with environment variables and registers an error listener', () => {
    jest.replaceProperty(process, 'env', {
      ...process.env, DATABASE_HOST: 'test-host', DATABASE_PORT: '5433',
      DATABASE_NAME: 'test-db', DATABASE_USER: 'test-user', DATABASE_PASSWORD: 'test-password',
    })
    // Reevaluate only this module, keeping the pg mock in the outer registry.
    jest.isolateModules(() => { require('./database') })
    expect(PoolMocked).toHaveBeenCalledWith({
      host: 'test-host', port: 5433, database: 'test-db', user: 'test-user', password: 'test-password',
    })
    const pool = PoolMocked.mock.results[0].value as Pool
    const on = jest.mocked(pool.on)
    expect(on).toHaveBeenCalledWith('error', expect.any(Function))
    const listener = on.mock.calls[0][1] as (error: Error) => void
    const error = new Error('Connection lost')
    listener(error)
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Unexpected database error:', error)
  })

  it('checks the connection and releases the client', async () => {
    const client = { query: jest.fn(), release: jest.fn() }
    const queryMocked = jest.mocked(client.query)
    const releaseMocked = jest.mocked(client.release)
    queryMocked.mockResolvedValue({ rows: [{ '?column?': 1 }] })
    connectMocked.mockResolvedValue(client as unknown as PoolClient)
    await expect(connectDatabase()).resolves.toBeUndefined()
    expect(connectMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith('SELECT 1')
    expect(releaseMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(console.log)).toHaveBeenCalledWith('Database connected successfully')
  })

  it('releases the client even if the health query fails', async () => {
    const error = new Error('Query failed')
    const client = { query: jest.fn(), release: jest.fn() }
    jest.mocked(client.query).mockRejectedValue(error)
    connectMocked.mockResolvedValue(client as unknown as PoolClient)
    await expect(connectDatabase()).rejects.toBe(error)
    expect(jest.mocked(client.release)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(console.log)).not.toHaveBeenCalled()
  })

  it('propagates a connection failure', async () => {
    const error = new Error('Cannot connect')
    connectMocked.mockRejectedValue(error)
    await expect(connectDatabase()).rejects.toBe(error)
    expect(jest.mocked(console.log)).not.toHaveBeenCalled()
  })
})
