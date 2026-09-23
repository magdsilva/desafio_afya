import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { deletePatient } from '../../../use-cases/patients/delete-patient'
import { validatePatientId } from './validate'

const deletePatientController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'delete_patient.started',
    message: 'Request started: delete patient',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error } = validatePatientId(id)

  if (error) {
    logger.warn({
      event: 'delete_patient.validation_failed',
      message: 'Request rejected: delete patient (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const deleted = await deletePatient(id)

  if (!deleted) {
    logger.warn({
      event: 'delete_patient.not_found',
      message: 'Request rejected: delete patient (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  logger.info({
    event: 'delete_patient.completed',
    message: 'Request completed: delete patient',
    user_id: request.userId,
    status_code: 204,
  })

  return response.status(204).send()
}

export { deletePatientController }