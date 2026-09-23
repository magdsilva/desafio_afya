import { ConsultationNote } from '../../interfaces/consultation-notes'

import { getAppointmentById } from '../../repositories/appointments/get-appointment-by-id'
import {
  createConsultationNote as createConsultationNoteRepository
} from '../../repositories/consultation-notes/create-consultation-note'

const createConsultationNote = async (
  appointmentId: string,
  userId: string,
  description: string
): Promise<ConsultationNote | null> => {
  const appointment = await getAppointmentById(
    appointmentId,
    userId
  )

  if (!appointment) {
    return null
  }

  return createConsultationNoteRepository(
    appointmentId,
    description
  )
}

export { createConsultationNote }