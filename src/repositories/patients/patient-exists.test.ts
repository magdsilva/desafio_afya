import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { patientExists } from './patient-exists'
import { id } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('Repository - patient-exists', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 })

    await expect(patientExists(id)).resolves.toEqual(true)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('SELECT 1')
    expect(sql).toContain('FROM patients')
    expect(sql).toContain('WHERE id = $1')
    expect(sql).toContain('LIMIT 1')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(patientExists(id)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(patientExists(id)).resolves.toEqual(false)
  })
})
