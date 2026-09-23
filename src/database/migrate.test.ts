import fs from 'node:fs/promises'
import path from 'node:path'
import { PoolClient } from 'pg'
import { database } from '../config/database'
import { DatabaseQuery } from '../__test-support__/database'

jest.mock('dotenv/config', () => ({}))
jest.mock('node:fs/promises')
jest.mock('../config/database', () => ({ database: { connect: jest.fn(), end: jest.fn() } }))

const connectMocked = jest.mocked(database.connect as () => Promise<PoolClient>)
const endMocked = jest.mocked(database.end as () => Promise<void>)
const readdirMocked = jest.mocked(fs.readdir as (directory: string) => Promise<string[]>)
const readFileMocked = jest.mocked(fs.readFile)
const client = {
  query: jest.fn<ReturnType<DatabaseQuery>, Parameters<DatabaseQuery>>(),
  release: jest.fn(),
}
const queryMocked = jest.mocked(client.query)
const releaseMocked = jest.mocked(client.release)
const migrationsPath = path.resolve(process.cwd(), 'src', 'database', 'migrations')

const runMigrations = async () => {
  jest.isolateModules(() => { require('./migrate') })
  // All I/O is mocked: let the script's promise chain finish before assertions.
  await new Promise<void>((resolve) => setImmediate(resolve))
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(process, 'exit').mockImplementation(() => undefined as never)
  connectMocked.mockResolvedValue(client as unknown as PoolClient)
  endMocked.mockResolvedValue(undefined)
  readdirMocked.mockResolvedValue(['001.sql'])
  readFileMocked.mockResolvedValue('CREATE TABLE example (id INT)')
  queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
})

describe('Database - migrate', () => {
  it('applies only SQL files in filename order within transactions', async () => {
    readdirMocked.mockResolvedValue(['002.sql', 'README.md', '001.sql'])
    readFileMocked.mockResolvedValueOnce('SQL ONE').mockResolvedValueOnce('SQL TWO')
    await runMigrations()

    expect(readdirMocked).toHaveBeenCalledWith(migrationsPath)
    expect(readFileMocked).toHaveBeenNthCalledWith(1, path.join(migrationsPath, '001.sql'), 'utf-8')
    expect(readFileMocked).toHaveBeenNthCalledWith(2, path.join(migrationsPath, '002.sql'), 'utf-8')
    expect(readFileMocked).toHaveBeenCalledTimes(2)
    expect(queryMocked.mock.calls).toEqual([
      [expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations')],
      ['SELECT 1 FROM schema_migrations WHERE filename = $1', ['001.sql']],
      ['BEGIN'], ['SQL ONE'],
      ['INSERT INTO schema_migrations (filename) VALUES ($1)', ['001.sql']],
      ['COMMIT'],
      ['SELECT 1 FROM schema_migrations WHERE filename = $1', ['002.sql']],
      ['BEGIN'], ['SQL TWO'],
      ['INSERT INTO schema_migrations (filename) VALUES ($1)', ['002.sql']],
      ['COMMIT'],
    ])
    expect(releaseMocked).toHaveBeenCalledTimes(1)
    expect(endMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(process.exit)).not.toHaveBeenCalled()
  })

  it('skips previously executed migrations', async () => {
    queryMocked.mockResolvedValueOnce({ rows: [], rowCount: 0 }).mockResolvedValueOnce({ rows: [{}], rowCount: 1 })
    await runMigrations()
    expect(readFileMocked).not.toHaveBeenCalled()
    expect(queryMocked).not.toHaveBeenCalledWith('BEGIN')
    expect(jest.mocked(console.log)).toHaveBeenCalledWith('Skipping migration: 001.sql')
    expect(releaseMocked).toHaveBeenCalledTimes(1)
    expect(endMocked).toHaveBeenCalledTimes(1)
  })

  it('closes the connection when the migration directory is empty', async () => {
    readdirMocked.mockResolvedValue([])
    await runMigrations()
    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(readFileMocked).not.toHaveBeenCalled()
    expect(releaseMocked).toHaveBeenCalledTimes(1)
    expect(endMocked).toHaveBeenCalledTimes(1)
  })

  it.each(['SQL', 'record'])('rolls back when the migration %s fails and stops subsequent migrations', async (step) => {
    const error = new Error('Migration failed')
    readdirMocked.mockResolvedValue(['001.sql', '002.sql'])
    queryMocked.mockImplementation(async (sql) => {
      if ((step === 'SQL' && sql.startsWith('CREATE TABLE example')) ||
          (step === 'record' && sql.startsWith('INSERT INTO schema_migrations'))) throw error
      return { rows: [], rowCount: 0 }
    })
    await runMigrations()
    expect(queryMocked).toHaveBeenCalledWith('ROLLBACK')
    expect(queryMocked).not.toHaveBeenCalledWith('COMMIT')
    expect(readFileMocked).toHaveBeenCalledTimes(1)
    expect(releaseMocked).toHaveBeenCalledTimes(1)
    expect(endMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Migration failed:', error)
    expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1)
  })

  it.each(['directory', 'file', 'schema'])('releases resources after a failure reading %s', async (step) => {
    const error = new Error('Preparation failed')
    if (step === 'directory') readdirMocked.mockRejectedValue(error)
    if (step === 'file') readFileMocked.mockRejectedValue(error)
    if (step === 'schema') queryMocked.mockRejectedValue(error)
    await runMigrations()
    expect(queryMocked).not.toHaveBeenCalledWith('BEGIN')
    expect(releaseMocked).toHaveBeenCalledTimes(1)
    expect(endMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Migration failed:', error)
    expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1)
  })

  it('logs a connection failure and exits without running queries', async () => {
    const error = new Error('Connection failed')
    connectMocked.mockRejectedValue(error)
    await runMigrations()
    expect(queryMocked).not.toHaveBeenCalled()
    expect(releaseMocked).not.toHaveBeenCalled()
    expect(jest.mocked(console.error)).toHaveBeenCalledWith('Migration failed:', error)
    expect(jest.mocked(process.exit)).toHaveBeenCalledWith(1)
  })
})
