import { deleteAppointment } from './delete-appointment'
import { deleteAppointment as deleteAppointmentRepository } from '../../repositories/appointments/delete-appointment'
import { id, userId } from '../../__test-support__/fixtures'

jest.mock('../../repositories/appointments/delete-appointment')
const deleteAppointmentMocked = jest.mocked(deleteAppointmentRepository)

beforeEach(() => { deleteAppointmentMocked.mockReset() })

describe('deleteAppointment', () => {
  it('passes the input to the repository and returns its result', async () => {
    deleteAppointmentMocked.mockResolvedValue(true)
    await expect(deleteAppointment(id, userId)).resolves.toEqual(true)
    expect(deleteAppointmentMocked).toHaveBeenCalledTimes(1)
    expect(deleteAppointmentMocked).toHaveBeenCalledWith(id, userId)
  })

  it('preserves an empty repository result', async () => {
    deleteAppointmentMocked.mockResolvedValue(false)
    await expect(deleteAppointment(id, userId)).resolves.toEqual(false)
  })

  it('propagates repository failures', async () => {
    const error = new Error('Repository failed')
    deleteAppointmentMocked.mockRejectedValue(error)
    await expect(deleteAppointment(id, userId)).rejects.toBe(error)
  })
})
