import { getPatientById } from './get-patient-by-id'
import { getPatientById as getPatientByIdRepository } from '../../repositories/patients/get-patient-by-id'
import { id, patient } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/get-patient-by-id')
const getPatientByIdMocked = jest.mocked(getPatientByIdRepository)

beforeEach(() => { getPatientByIdMocked.mockReset() })

describe('Use Case - get-patient-by-id', () => {
  it('passes the input to the repository and returns its result', async () => {
    getPatientByIdMocked.mockResolvedValue(patient)
    await expect(getPatientById(id)).resolves.toEqual(patient)
    expect(getPatientByIdMocked).toHaveBeenCalledTimes(1)
    expect(getPatientByIdMocked).toHaveBeenCalledWith(id)
  })

  it('preserves an empty repository result', async () => {
    getPatientByIdMocked.mockResolvedValue(null)
    await expect(getPatientById(id)).resolves.toEqual(null)
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    getPatientByIdMocked.mockRejectedValue(error)
    await expect(getPatientById(id)).rejects.toBe(error)
  })
})
