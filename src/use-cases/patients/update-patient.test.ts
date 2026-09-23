import { updatePatient } from './update-patient'
import { updatePatient as updatePatientRepository } from '../../repositories/patients/update-patient'
import { id, patientInput, patient } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/update-patient')
const updatePatientMocked = jest.mocked(updatePatientRepository)

beforeEach(() => { updatePatientMocked.mockReset() })

describe('Use Case - update-patient', () => {
  it('passes the input to the repository and returns its result', async () => {
    updatePatientMocked.mockResolvedValue(patient)
    await expect(updatePatient(id, patientInput)).resolves.toEqual(patient)
    expect(updatePatientMocked).toHaveBeenCalledTimes(1)
    expect(updatePatientMocked).toHaveBeenCalledWith(id, patientInput)
  })

  it('preserves an empty repository result', async () => {
    updatePatientMocked.mockResolvedValue(null)
    await expect(updatePatient(id, patientInput)).resolves.toEqual(null)
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    updatePatientMocked.mockRejectedValue(error)
    await expect(updatePatient(id, patientInput)).rejects.toBe(error)
  })
})
