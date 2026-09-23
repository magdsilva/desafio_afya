import { createPatient } from './create-patient'
import { createPatient as createPatientRepository } from '../../repositories/patients/create-patient'
import { patientInput, patient } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/create-patient')
const createPatientMocked = jest.mocked(createPatientRepository)

beforeEach(() => { createPatientMocked.mockReset() })

describe('createPatient', () => {
  it('passes the input to the repository and returns its result', async () => {
    createPatientMocked.mockResolvedValue(patient)
    await expect(createPatient(patientInput)).resolves.toEqual(patient)
    expect(createPatientMocked).toHaveBeenCalledTimes(1)
    expect(createPatientMocked).toHaveBeenCalledWith(patientInput)
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    createPatientMocked.mockRejectedValue(error)
    await expect(createPatient(patientInput)).rejects.toBe(error)
  })
})
