import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { getPatientAppointmentHistory } from '../../../use-cases/appointments/get-patient-appointment-history'
import { validatePatientId } from './validate'

const getPatientAppointmentHistoryController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'get_patient_appointment_history.started',
    message: 'Request started: get patient appointment history',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error } = validatePatientId(id)

  if (error) {
    logger.warn({
      event: 'get_patient_appointment_history.validation_failed',
      message: 'Request rejected: get patient appointment history (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const { history, patientFound } =
    await getPatientAppointmentHistory(
      id,
      request.userId as string
    )

  if (!patientFound) {
    logger.warn({
      event: 'get_patient_appointment_history.not_found',
      message: 'Request rejected: get patient appointment history (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  logger.info({
    event: 'get_patient_appointment_history.completed',
    message: 'Request completed: get patient appointment history',
    user_id: request.userId,
    status_code: 200,
  })

  return response.status(200).json(history)
}

export { getPatientAppointmentHistoryController }