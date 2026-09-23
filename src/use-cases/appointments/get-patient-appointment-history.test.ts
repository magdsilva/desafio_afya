import { getPatientAppointmentHistory } from './get-patient-appointment-history'
import { getPatientById } from '../../repositories/patients/get-patient-by-id'
import { getPatientAppointmentHistory as getPatientAppointmentHistoryRepository } from '../../repositories/appointments/get-patient-appointment-history'
import { id, userId, patient, history } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/get-patient-by-id')
jest.mock('../../repositories/appointments/get-patient-appointment-history')

const getPatientByIdMocked = jest.mocked(getPatientById)
const getPatientAppointmentHistoryMocked = jest.mocked(getPatientAppointmentHistoryRepository)

beforeEach(() => {
  jest.resetAllMocks()
  getPatientByIdMocked.mockResolvedValue(patient)
})

describe('getPatientAppointmentHistory', () => {
  it.each([{ result: history }, { result: [] }])('returns the patient history: %j', async ({ result }) => {
    getPatientAppointmentHistoryMocked.mockResolvedValue(result)
    await expect(getPatientAppointmentHistory(id, userId)).resolves.toEqual({ history: result, patientFound: true })
    expect(getPatientByIdMocked).toHaveBeenCalledWith(id)
    expect(getPatientAppointmentHistoryMocked).toHaveBeenCalledWith(id, userId)
  })

  it('stops when the patient does not exist', async () => {
    getPatientByIdMocked.mockResolvedValue(null)
    await expect(getPatientAppointmentHistory(id, userId)).resolves.toEqual({ history: [], patientFound: false })
    expect(getPatientAppointmentHistoryMocked).not.toHaveBeenCalled()
  })

  it.each(['patient', 'history'])('propagates a failure in %s', async (step) => {
    const error = new Error('Repository failed')
    if (step === 'patient') getPatientByIdMocked.mockRejectedValue(error)
    else getPatientAppointmentHistoryMocked.mockRejectedValue(error)
    await expect(getPatientAppointmentHistory(id, userId)).rejects.toBe(error)
  })
})
