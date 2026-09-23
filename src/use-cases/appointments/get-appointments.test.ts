import { getAppointments } from './get-appointments'
import { getAppointments as getAppointmentsRepository } from '../../repositories/appointments/get-appointments'
import { userId, appointment } from '../../__test-support__/fixtures'

jest.mock('../../repositories/appointments/get-appointments')
const getAppointmentsMocked = jest.mocked(getAppointmentsRepository)

beforeEach(() => { getAppointmentsMocked.mockReset() })

describe('Use Case - get-appointments', () => {
  it('passes the input to the repository and returns its result', async () => {
    getAppointmentsMocked.mockResolvedValue([appointment])
    await expect(getAppointments(userId)).resolves.toEqual([appointment])
    expect(getAppointmentsMocked).toHaveBeenCalledTimes(1)
    expect(getAppointmentsMocked).toHaveBeenCalledWith(userId)
  })

  it('preserves an empty repository result', async () => {
    getAppointmentsMocked.mockResolvedValue([])
    await expect(getAppointments(userId)).resolves.toEqual([])
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    getAppointmentsMocked.mockRejectedValue(error)
    await expect(getAppointments(userId)).rejects.toBe(error)
  })
})
