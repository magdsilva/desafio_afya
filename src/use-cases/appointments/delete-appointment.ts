import {
  deleteAppointment as deleteAppointmentRepository
} from '../../repositories/appointments/delete-appointment'

const deleteAppointment = async (
  id: string,
  userId: string
): Promise<boolean> => {
  return deleteAppointmentRepository(
    id,
    userId
  )
}

export { deleteAppointment }