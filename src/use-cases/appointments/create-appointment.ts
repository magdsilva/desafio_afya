import {
  Appointment,
  CreateAppointmentInput
} from '../../interfaces/appointments'

import { getPatientById } from '../../repositories/patients/get-patient-by-id'
import {
  createAppointment as createAppointmentRepository
} from '../../repositories/appointments/create-appointment'
import { getAppointmentBySchedule } from '../../repositories/appointments/get-appointment-by-schedule'

interface CreateAppointmentResult {
  appointment: Appointment | null
  conflict: boolean
}

const createAppointment = async (
  data: CreateAppointmentInput
): Promise<CreateAppointmentResult> => {
  const patient = await getPatientById(data.patientId)

  if (!patient) {
    return {
      appointment: null,
      conflict: false
    }
  }

  const scheduledAt = `${data.date}T${data.time}:00`

  const scheduleConflict = await getAppointmentBySchedule(
    data.userId,
    scheduledAt
  )

  if (scheduleConflict) {
    return {
      appointment: null,
      conflict: true
    }
  }

  const appointment = await createAppointmentRepository({
    userId: data.userId,
    patientId: data.patientId,
    scheduledAt
  })

  if (!appointment) {
    return {
      appointment: null,
      conflict: true
    }
  }

  return {
    appointment,
    conflict: false
  }
}

export { createAppointment }