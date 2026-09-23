import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { updatePatient } from './update-patient'
import { id, patientInput, patient } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('Repository - update-patient', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })

    await expect(updatePatient(id, patientInput)).resolves.toEqual(patient)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, patientInput.name, patientInput.phone, patientInput.email, patientInput.birthDate, patientInput.gender, patientInput.heightCm, patientInput.weightGrams])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain('UPDATE patients')
    expect(sql).toContain('WHERE id = $1')
    expect(sql).toContain('AND deleted_at IS NULL')
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(updatePatient(id, patientInput)).rejects.toBe(error)
  })

  it('handles a query without matching rows', async () => {
    queryMocked.mockResolvedValue({ rows: [], rowCount: 0 })
    await expect(updatePatient(id, patientInput)).resolves.toEqual(null)
  })

  it('uses null for omitted fields in a partial update', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })
    await updatePatient(id, { name: 'Updated name' })
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, 'Updated name', null, null, null, null, null, null])
  })

  it('accepts an update without a name', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })
    await updatePatient(id, { phone: '123' })
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [id, null, '123', null, null, null, null, null])
  })
})
