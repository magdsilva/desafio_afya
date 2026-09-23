import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { getPatientAppointmentHistory } from './get-patient-appointment-history'
import { id, userId, patient, appointment, history } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('getPatientAppointmentHistory repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [history[0]], rowCount: 1 })

    await expect(getPatientAppointmentHistory(id, userId)).resolves.toEqual([history[0]])

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, userId])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain("LEFT JOIN consultation_notes")
    expect(sql).toContain("WHERE a.patient_id = $1")
    expect(sql).toContain("AND a.user_id = $2")
    expect(sql).toContain("ORDER BY a.scheduled_at DESC")
    expect(sql).toContain("'[]'::json")
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(getPatientAppointmentHistory(id, userId)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(getPatientAppointmentHistory(id, userId)).resolves.toEqual([])
  })
})
