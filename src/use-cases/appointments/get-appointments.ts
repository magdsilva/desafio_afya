import { Appointment } from '../../interfaces/appointments'

import {
  getAppointments as getAppointmentsRepository
} from '../../repositories/appointments/get-appointments'

const getAppointments = async (
  userId: string
): Promise<Appointment[]> => {
  return getAppointmentsRepository(userId)
}

export { getAppointments }