import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { updatePatient } from '../../../use-cases/patients/update-patient'
import { validate, validatePatientId } from './validate'

const updatePatientController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'update_patient.started',
    message: 'Request started: update patient',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error: idError } = validatePatientId(id)

  if (idError) {
    logger.warn({
      event: 'update_patient.validation_failed',
      message: 'Request rejected: update patient (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const { error, value } = validate(request.body)

  if (error) {
    logger.warn({
      event: 'update_patient.validation_failed',
      message: 'Request rejected: update patient (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const patient = await updatePatient(id, value)

  if (!patient) {
    logger.warn({
      event: 'update_patient.not_found',
      message: 'Request rejected: update patient (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  logger.info({
    event: 'update_patient.completed',
    message: 'Request completed: update patient',
    user_id: request.userId,
    status_code: 200,
  })

  return response.status(200).json(patient)
}

export { updatePatientController }