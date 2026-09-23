import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { createConsultationNote } from './create-consultation-note'
import { id, note } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('Repository - create-consultation-note', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [note], rowCount: 1 })

    await expect(createConsultationNote(id, note.description)).resolves.toEqual(note)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, note.description])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('INSERT INTO consultation_notes')
    expect(sql).toContain('VALUES ($1, $2)')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(createConsultationNote(id, note.description)).rejects.toBe(error)
  })
})
