import { logger } from '../../../config/logger'
import { Request, Response } from 'express'
import { createPatient } from '../../../use-cases/patients/create-patient'
import { validate } from './validate'

export const createPatientController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'create_patient.started',
    message: 'Request started: create patient',
    user_id: request.userId,
  })

  const { error, value } = validate(request.body)

  if (error) {
    logger.warn({
      event: 'create_patient.validation_failed',
      message: 'Request rejected: create patient (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const patient = await createPatient(value)

  logger.info({
    event: 'create_patient.completed',
    message: 'Request completed: create patient',
    user_id: request.userId,
    status_code: 201,
  })

  return response.status(201).json(patient)
}
