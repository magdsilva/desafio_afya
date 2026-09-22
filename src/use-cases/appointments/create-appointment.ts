import {
  Appointment,
  CreateAppointmentInput
} from '../../interfaces/appointments'

import { getPatientById } from '../../repositories/patients/get-patient-by-id'
import {
  createAppointment as createAppointmentRepository
} from '../../repositories/appointments/create-appointment'

const createAppointment = async (
  data: CreateAppointmentInput
): Promise<Appointment | null> => {
  const patient = await getPatientById(data.patientId)

  if (!patient) {
    return null
  }

  const scheduledAt = `${data.date}T${data.time}:00`

  return createAppointmentRepository({
    userId: data.userId,
    patientId: data.patientId,
    scheduledAt
  })
}

export { createAppointment }