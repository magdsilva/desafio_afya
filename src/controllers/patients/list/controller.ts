import { logger } from '../../../config/logger'
import { Request, Response } from 'express'
import { getPatients } from '../../../use-cases/patients/get-patients'

export const getPatientsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'get_patients.started',
    message: 'Request started: get patients',
    user_id: request.userId,
  })

  const patients = await getPatients()

  logger.info({
    event: 'get_patients.completed',
    message: 'Request completed: get patients',
    user_id: request.userId,
    status_code: 200,
  })

  return response.status(200).json(patients)
}
