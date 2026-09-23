import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { updateAppointment } from './update-appointment'
import { id, userId, appointment } from '../../__test-support__/fixtures'
import { DatabaseError } from 'pg'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('Repository - update-appointment', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [appointment], rowCount: 1 })

    await expect(updateAppointment(id, userId, appointment)).resolves.toEqual(appointment)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, userId, '2026-10-01T09:30:00', 'SCHEDULED'])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('UPDATE appointments')
    expect(sql).toContain('WHERE id = $1')
    expect(sql).toContain('AND user_id = $2')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(updateAppointment(id, userId, appointment)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(updateAppointment(id, userId, appointment)).resolves.toEqual(null)
  })

  it('returns null for a concurrent schedule conflict', async () => {
    const error = new DatabaseError('Duplicate schedule', 0, 'error')
    error.code = '23505'
    error.constraint = 'unique_user_schedule'
    queryMocked.mockRejectedValue(error)
    await expect(updateAppointment(id, userId, appointment)).resolves.toBeNull()
  })

  it.each([
    ['23505', 'another_constraint'],
    ['23503', 'unique_user_schedule'],
  ])('propagates database error %s on %s', async (code, constraint) => {
    const error = new DatabaseError('Constraint failed', 0, 'error')
    error.code = code
    error.constraint = constraint
    queryMocked.mockRejectedValue(error)
    await expect(updateAppointment(id, userId, appointment)).rejects.toBe(error)
  })
})
