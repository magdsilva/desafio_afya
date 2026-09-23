import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { getPatients } from './get-patients'
import { patient } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('Repository - get-patients', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })

    await expect(getPatients()).resolves.toEqual([patient])

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String))
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('FROM patients')
    expect(sql).toContain('WHERE deleted_at IS NULL')
    expect(sql).toContain('ORDER BY name')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(getPatients()).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(getPatients()).resolves.toEqual([])
  })
})
