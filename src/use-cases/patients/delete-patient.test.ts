import { deletePatient } from './delete-patient'
import { deletePatient as deletePatientRepository } from '../../repositories/patients/delete-patient'
import { id, patient } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/delete-patient')
const deletePatientMocked = jest.mocked(deletePatientRepository)

beforeEach(() => { deletePatientMocked.mockReset() })

describe('deletePatient', () => {
  it('passes the input to the repository and returns its result', async () => {
    deletePatientMocked.mockResolvedValue(true)
    await expect(deletePatient(id)).resolves.toEqual(true)
    expect(deletePatientMocked).toHaveBeenCalledTimes(1)
    expect(deletePatientMocked).toHaveBeenCalledWith(id)
  })

  it('preserves an empty repository result', async () => {
    deletePatientMocked.mockResolvedValue(false)
    await expect(deletePatient(id)).resolves.toEqual(false)
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    deletePatientMocked.mockRejectedValue(error)
    await expect(deletePatient(id)).rejects.toBe(error)
  })
})
