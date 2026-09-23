import { logger } from '../../../config/logger'
import { Request, Response } from 'express'
import { getPatientById } from '../../../use-cases/patients/get-patient-by-id'
import { validatePatientId } from './validate'

export const getPatientByIdController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'get_patient_by_id.started',
    message: 'Request started: get patient by id',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error } = validatePatientId(id)

  if (error) {
    logger.warn({
      event: 'get_patient_by_id.validation_failed',
      message: 'Request rejected: get patient by id (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const patient = await getPatientById(id)

  if (!patient) {
    logger.warn({
      event: 'get_patient_by_id.not_found',
      message: 'Request rejected: get patient by id (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  logger.info({
    event: 'get_patient_by_id.completed',
    message: 'Request completed: get patient by id',
    user_id: request.userId,
    status_code: 200,
  })

  return response.status(200).json(patient)
}
