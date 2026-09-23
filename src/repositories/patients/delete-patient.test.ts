import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { deletePatient } from './delete-patient'
import { id, patient } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('deletePatient repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })

    await expect(deletePatient(id)).resolves.toEqual(true)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain("name = 'Paciente anonimizado'")
    expect(sql).toContain('phone = NULL')
    expect(sql).toContain('email = NULL')
    expect(sql).toContain('birth_date = NULL')
    expect(sql).toContain('gender = NULL')
    expect(sql).toContain('height = NULL')
    expect(sql).toContain('weight = NULL')
    expect(sql).toContain('deleted_at = NOW()')
    expect(sql).toContain('WHERE id = $1')
    expect(sql).toContain('AND deleted_at IS NULL')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(deletePatient(id)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(deletePatient(id)).resolves.toEqual(false)
  })
})
