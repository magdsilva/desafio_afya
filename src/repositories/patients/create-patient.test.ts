import { DatabaseQuery } from '../../__test-support__/database'
import { database } from '../../config/database'
import { createPatient } from './create-patient'
import { patientInput, patient } from '../../__test-support__/fixtures'

jest.mock('../../config/database', () => ({ database: { query: jest.fn() } }))

const queryMocked = jest.mocked(database.query as DatabaseQuery)

beforeEach(() => { queryMocked.mockReset() })

describe('createPatient repository', () => {
  it('executes a parameterized query and returns the result', async () => {
    queryMocked.mockResolvedValue({ rows: [patient], rowCount: 1 })

    await expect(createPatient(patientInput)).resolves.toEqual(patient)

    expect(queryMocked).toHaveBeenCalledTimes(1)
    expect(queryMocked).toHaveBeenCalledWith(expect.any(String), [patientInput.name, patientInput.phone, patientInput.email, patientInput.birthDate, patientInput.gender, patientInput.heightCm, patientInput.weightGrams])
    const sql = String(queryMocked.mock.calls[0][0]).replace(/\s+/g, ' ')
    expect(sql).toContain("INSERT INTO patients")
    expect(sql).toContain("VALUES ($1, $2, $3, $4, $5, $6, $7)")
  })

  it('propagates database failures', async () => {
    const error = new Error('Database unavailable')
    queryMocked.mockRejectedValue(error)
    await expect(createPatient(patientInput)).rejects.toBe(error)
  })
})
