import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { getAppointmentBySchedule } from './get-appointment-by-schedule'
import { userId, appointment } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('getAppointmentBySchedule repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [appointment], rowCount: 1 })

    await expect(getAppointmentBySchedule(userId, '2026-10-01T09:30:00')).resolves.toEqual(true)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [userId, '2026-10-01T09:30:00'])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain("WHERE user_id = $1")
    expect(sql).toContain("AND scheduled_at = $2")
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(getAppointmentBySchedule(userId, '2026-10-01T09:30:00')).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(getAppointmentBySchedule(userId, '2026-10-01T09:30:00')).resolves.toEqual(false)
  })
})
