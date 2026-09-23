import { PatientAppointmentHistory } from '../../interfaces/appointments'

import { getPatientById } from '../../repositories/patients/get-patient-by-id'
import {
  getPatientAppointmentHistory as getPatientAppointmentHistoryRepository
} from '../../repositories/appointments/get-patient-appointment-history'

interface PatientAppointmentHistoryResult {
  history: PatientAppointmentHistory[]
  patientFound: boolean
}

const getPatientAppointmentHistory = async (
  patientId: string,
  userId: string
): Promise<PatientAppointmentHistoryResult> => {
  const patient = await getPatientById(patientId)

  if (!patient) {
    return {
      history: [],
      patientFound: false
    }
  }

  const history = await getPatientAppointmentHistoryRepository(
    patientId,
    userId
  )

  return {
    history,
    patientFound: true
  }
}

export { getPatientAppointmentHistory }