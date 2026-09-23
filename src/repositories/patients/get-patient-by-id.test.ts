import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { getPatientById } from './get-patient-by-id'
import { id, patient } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('getPatientById repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })

    await expect(getPatientById(id)).resolves.toEqual(patient)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('WHERE id = $1')
    expect(sql).toContain('AND deleted_at IS NULL')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(getPatientById(id)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(getPatientById(id)).resolves.toEqual(null)
  })
})
