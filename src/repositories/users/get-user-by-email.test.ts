import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { getUserByEmail } from './get-user-by-email'
import { user } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('getUserByEmail repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [user], rowCount: 1 })

    await expect(getUserByEmail(user.email)).resolves.toEqual(user)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [user.email])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain("FROM users")
    expect(sql).toContain("WHERE email = $1")
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(getUserByEmail(user.email)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(getUserByEmail(user.email)).resolves.toEqual(null)
  })
})
