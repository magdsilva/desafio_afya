import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { getAppointments } from './get-appointments'
import { userId, appointment } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('Repository - get-appointments', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [appointment], rowCount: 1 })

    await expect(getAppointments(userId)).resolves.toEqual([appointment])

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [userId])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('WHERE user_id = $1')
    expect(sql).toContain('ORDER BY scheduled_at ASC')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(getAppointments(userId)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(getAppointments(userId)).resolves.toEqual([])
  })
})
