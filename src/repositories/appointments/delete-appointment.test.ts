import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { deleteAppointment } from './delete-appointment'
import { id, userId, appointment } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('deleteAppointment repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [appointment], rowCount: 1 })

    await expect(deleteAppointment(id, userId)).resolves.toEqual(true)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, userId])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('DELETE FROM appointments')
    expect(sql).toContain('WHERE id = $1')
    expect(sql).toContain('AND user_id = $2')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(deleteAppointment(id, userId)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(deleteAppointment(id, userId)).resolves.toEqual(false)
  })
})
