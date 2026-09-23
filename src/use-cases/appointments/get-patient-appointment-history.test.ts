import { getPatientAppointmentHistory } from './get-patient-appointment-history'
import { getPatientAppointmentHistory as getPatientAppointmentHistoryRepository } from '../../repositories/appointments/get-patient-appointment-history'
import { patientExists } from '../../repositories/patients/patient-exists'
import { id, userId, history } from '../../__test-support__/fixtures'
import { logger } from '../../config/logger'

jest.mock('../../repositories/patients/patient-exists')
jest.mock('../../repositories/appointments/get-patient-appointment-history')
jest.mock('../../config/logger')

const patientExistsMocked = jest.mocked(patientExists)
const getPatientAppointmentHistoryMocked = jest.mocked(
  getPatientAppointmentHistoryRepository
)

beforeEach(() => {
  jest.resetAllMocks()
  patientExistsMocked.mockResolvedValue(true)
})

describe('Use Case - get-patient-appointment-history', () => {
  it.each([
    { result: history },
    { result: [] }
  ])(
    'returns the patient history: %j',
    async ({ result }) => {
      getPatientAppointmentHistoryMocked.mockResolvedValue(result)

      await expect(
        getPatientAppointmentHistory(id, userId)
      ).resolves.toEqual({
        history: result,
        patientFound: true
      })

      expect(patientExistsMocked).toHaveBeenCalledWith(id)
      expect(
        getPatientAppointmentHistoryMocked
      ).toHaveBeenCalledWith(id, userId)
      expect(logger.info).toHaveBeenCalledWith({
        event: 'patient_history.fetched',
        message: 'Patient appointment history fetched',
        user_id: userId,
        result_count: result.length,
      })
    }
  )

  it('stops when the patient does not exist', async () => {
    patientExistsMocked.mockResolvedValue(false)

    await expect(
      getPatientAppointmentHistory(id, userId)
    ).resolves.toEqual({
      history: [],
      patientFound: false
    })

    expect(
      getPatientAppointmentHistoryMocked
    ).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith(expect.objectContaining({
      event: 'patient_history.patient_not_found', user_id: userId,
    }))
    expect(logger.info).not.toHaveBeenCalled()
  })

  it.each([
    'patient',
    'history'
  ])(
    'propagates a failure in %s',
    async (step) => {
      const error = new Error('Repository failed')

      if (step === 'patient') {
        patientExistsMocked.mockRejectedValue(error)
      } else {
        getPatientAppointmentHistoryMocked.mockRejectedValue(error)
      }

      await expect(
        getPatientAppointmentHistory(id, userId)
      ).rejects.toBe(error)
    }
  )
})
