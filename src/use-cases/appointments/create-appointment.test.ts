import { createAppointment } from './create-appointment'
import { getPatientById } from '../../repositories/patients/get-patient-by-id'
import { getAppointmentBySchedule } from '../../repositories/appointments/get-appointment-by-schedule'
import { createAppointment as createAppointmentRepository } from '../../repositories/appointments/create-appointment'
import { appointmentInput, appointment, patient, id, userId } from '../../__test-support__/fixtures'

jest.mock('../../repositories/patients/get-patient-by-id')
jest.mock('../../repositories/appointments/get-appointment-by-schedule')
jest.mock('../../repositories/appointments/create-appointment')

const getPatientByIdMocked = jest.mocked(getPatientById)
const getAppointmentByScheduleMocked = jest.mocked(getAppointmentBySchedule)
const createAppointmentMocked = jest.mocked(createAppointmentRepository)

beforeEach(() => {
  jest.resetAllMocks()
  getPatientByIdMocked.mockResolvedValue(patient)
  getAppointmentByScheduleMocked.mockResolvedValue(false)
  createAppointmentMocked.mockResolvedValue(appointment)
})

describe('Use Case - create-appointment', () => {
  it('creates an appointment with the combined date and time', async () => {
    await expect(createAppointment(appointmentInput)).resolves.toEqual({ appointment, conflict: false })
    expect(getPatientByIdMocked).toHaveBeenCalledWith(id)
    expect(getAppointmentByScheduleMocked).toHaveBeenCalledWith(userId, '2026-10-01T09:30:00')
    expect(createAppointmentMocked).toHaveBeenCalledWith({ userId, patientId: id, scheduledAt: '2026-10-01T09:30:00' })
  })

  it('stops when the patient does not exist', async () => {
    getPatientByIdMocked.mockResolvedValue(null)
    await expect(createAppointment(appointmentInput)).resolves.toEqual({ appointment: null, conflict: false })
    expect(getAppointmentByScheduleMocked).not.toHaveBeenCalled()
    expect(createAppointmentMocked).not.toHaveBeenCalled()
  })

  it('does not insert when the schedule is occupied', async () => {
    getAppointmentByScheduleMocked.mockResolvedValue(true)
    await expect(createAppointment(appointmentInput)).resolves.toEqual({ appointment: null, conflict: true })
    expect(createAppointmentMocked).not.toHaveBeenCalled()
  })

  it('reports a conflict detected during insertion', async () => {
    createAppointmentMocked.mockResolvedValue(null)
    await expect(createAppointment(appointmentInput)).resolves.toEqual({ appointment: null, conflict: true })
  })

  it.each(['patient', 'schedule', 'insert'])('propagates a failure in %s', async (step) => {
    const error = new Error('Repository failed')
    if (step === 'patient') getPatientByIdMocked.mockRejectedValue(error)
    if (step === 'schedule') getAppointmentByScheduleMocked.mockRejectedValue(error)
    if (step === 'insert') createAppointmentMocked.mockRejectedValue(error)
    await expect(createAppointment(appointmentInput)).rejects.toBe(error)
    if (step !== 'insert') expect(createAppointmentMocked).not.toHaveBeenCalled()
  })
})
