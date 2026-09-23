import { updateAppointment } from './update-appointment'
import { getAppointmentById } from '../../repositories/appointments/get-appointment-by-id'
import { getAppointmentBySchedule } from '../../repositories/appointments/get-appointment-by-schedule'
import { updateAppointment as updateAppointmentRepository } from '../../repositories/appointments/update-appointment'
import { appointment, id, userId } from '../../__test-support__/fixtures'

jest.mock('../../repositories/appointments/get-appointment-by-id')
jest.mock('../../repositories/appointments/get-appointment-by-schedule')
jest.mock('../../repositories/appointments/update-appointment')

const getAppointmentByIdMocked = jest.mocked(getAppointmentById)
const getAppointmentByScheduleMocked = jest.mocked(getAppointmentBySchedule)
const updateAppointmentMocked = jest.mocked(updateAppointmentRepository)

beforeEach(() => {
  jest.resetAllMocks()
  getAppointmentByIdMocked.mockResolvedValue(appointment)
  getAppointmentByScheduleMocked.mockResolvedValue(false)
  updateAppointmentMocked.mockResolvedValue(appointment)
})

describe('updateAppointment', () => {
  it('stops when the appointment is not found for the user', async () => {
    getAppointmentByIdMocked.mockResolvedValue(null)
    await expect(updateAppointment(id, userId, { status: 'COMPLETED' })).resolves.toEqual({ appointment: null, conflict: false })
    expect(getAppointmentByIdMocked).toHaveBeenCalledWith(id, userId)
    expect(getAppointmentByScheduleMocked).not.toHaveBeenCalled()
    expect(updateAppointmentMocked).not.toHaveBeenCalled()
  })

  it('preserves the schedule when changing only the status', async () => {
    const updated = { ...appointment, status: 'COMPLETED' }
    updateAppointmentMocked.mockResolvedValue(updated)
    await expect(updateAppointment(id, userId, { status: 'COMPLETED' })).resolves.toEqual({ appointment: updated, conflict: false })
    expect(updateAppointmentMocked).toHaveBeenCalledWith(id, userId, { date: appointment.date, time: appointment.time, status: 'COMPLETED' })
    expect(getAppointmentByScheduleMocked).not.toHaveBeenCalled()
  })

  it.each([
    [{ date: '2026-10-02' }, '2026-10-02T09:30:00'],
    [{ time: '10:00' }, '2026-10-01T10:00:00'],
    [{ date: '2026-10-02', time: '11:00' }, '2026-10-02T11:00:00'],
  ])('checks the new schedule for %j', async (data, scheduledAt) => {
    await expect(updateAppointment(id, userId, data)).resolves.toEqual({ appointment, conflict: false })
    expect(getAppointmentByScheduleMocked).toHaveBeenCalledWith(userId, scheduledAt)
    expect(updateAppointmentMocked).toHaveBeenCalledWith(id, userId, { date: appointment.date, time: appointment.time, status: appointment.status, ...data })
  })

  it('skips the schedule lookup when the supplied schedule is unchanged', async () => {
    await updateAppointment(id, userId, { date: appointment.date, time: appointment.time })
    expect(getAppointmentByScheduleMocked).not.toHaveBeenCalled()
  })

  it('does not update an occupied schedule', async () => {
    getAppointmentByScheduleMocked.mockResolvedValue(true)
    await expect(updateAppointment(id, userId, { time: '10:00' })).resolves.toEqual({ appointment: null, conflict: true })
    expect(updateAppointmentMocked).not.toHaveBeenCalled()
  })

  it('reports a conflict detected during the update', async () => {
    updateAppointmentMocked.mockResolvedValue(null)
    await expect(updateAppointment(id, userId, { time: '10:00' })).resolves.toEqual({ appointment: null, conflict: true })
  })

  it.each(['lookup', 'schedule', 'update'])('propagates a failure in %s', async (step) => {
    const error = new Error('Repository failed')
    if (step === 'lookup') getAppointmentByIdMocked.mockRejectedValue(error)
    if (step === 'schedule') getAppointmentByScheduleMocked.mockRejectedValue(error)
    if (step === 'update') updateAppointmentMocked.mockRejectedValue(error)
    await expect(updateAppointment(id, userId, { time: '10:00' })).rejects.toBe(error)
    if (step !== 'update') expect(updateAppointmentMocked).not.toHaveBeenCalled()
  })
})
