import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { createAppointment } from './create-appointment'
import { id, userId, appointment } from '../../__test-support__/fixtures'
import { DatabaseError } from 'pg'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('createAppointment repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [appointment], rowCount: 1 })

    await expect(createAppointment({ userId, patientId: id, scheduledAt: '2026-10-01T09:30:00' })).resolves.toEqual(appointment)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [userId, id, '2026-10-01T09:30:00'])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('INSERT INTO appointments')
    expect(sql).toContain('VALUES ($1, $2, $3)')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(createAppointment({ userId, patientId: id, scheduledAt: '2026-10-01T09:30:00' })).rejects.toBe(error)
  })

  it('returns null for a concurrent schedule conflict', async () => {
    const error = new DatabaseError('Duplicate schedule', 0, 'error')
    error.code = '23505'
    error.constraint = 'unique_user_schedule'
    queryMocked.mockRejectedValue(error)
    await expect(createAppointment({ userId, patientId: id, scheduledAt: '2026-10-01T09:30:00' })).resolves.toBeNull()
  })

  it.each([
    ['23505', 'another_constraint'],
    ['23503', 'unique_user_schedule'],
  ])('propagates database error %s on %s', async (code, constraint) => {
    const error = new DatabaseError('Constraint failed', 0, 'error')
    error.code = code
    error.constraint = constraint
    queryMocked.mockRejectedValue(error)
    await expect(createAppointment({ userId, patientId: id, scheduledAt: '2026-10-01T09:30:00' })).rejects.toBe(error)
  })
})
