import { getPatients } from './get-patients'
import { getPatients as getPatientsRepository } from '../../repositories/patients/get-patients'
import { patient } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/get-patients')
const getPatientsMocked = jest.mocked(getPatientsRepository)

beforeEach(() => { getPatientsMocked.mockReset() })

describe('Use Case - get-patients', () => {
  it('passes the input to the repository and returns its result', async () => {
    getPatientsMocked.mockResolvedValue([patient])
    await expect(getPatients()).resolves.toEqual([patient])
    expect(getPatientsMocked).toHaveBeenCalledTimes(1)
    expect(getPatientsMocked).toHaveBeenCalledWith()
  })

  it('preserves an empty repository result', async () => {
    getPatientsMocked.mockResolvedValue([])
    await expect(getPatients()).resolves.toEqual([])
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    getPatientsMocked.mockRejectedValue(error)
    await expect(getPatients()).rejects.toBe(error)
  })
})
