import { PatientAppointmentHistory } from '../../interfaces/appointments'

import { patientExists } from '../../repositories/patients/patient-exists'
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
  const exists = await patientExists(patientId)

  if (!exists) {
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