import { Request, Response } from 'express'
import { createPatient } from '../../../use-cases/patients/create-patient'
import { validate } from './validate'

export const createPatientController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { error, value } = validate(request.body)

  if (error) {
    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const patient = await createPatient(value)

  return response.status(201).json(patient)
}
