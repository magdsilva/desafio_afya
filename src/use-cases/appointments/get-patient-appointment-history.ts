import { PatientAppointmentHistory } from '../../interfaces/appointments'
import { logger } from '../../config/logger'

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
    logger.warn({
      event: 'patient_history.patient_not_found',
      message: 'Patient not found while fetching appointment history',
      user_id: userId,
    })
    return {
      history: [],
      patientFound: false
    }
  }

  const history = await getPatientAppointmentHistoryRepository(
    patientId,
    userId
  )

  logger.info({
    event: 'patient_history.fetched',
    message: 'Patient appointment history fetched',
    user_id: userId,
    result_count: history.length,
  })

  return {
    history,
    patientFound: true
  }
}

export { getPatientAppointmentHistory }
