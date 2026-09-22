import { Request, Response } from 'express'

import { updatePatient } from '../../../use-cases/patients/update-patient'
import { validate, validatePatientId } from './validate'

const updatePatientController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params

  const { error: idError } = validatePatientId(id)

  if (idError) {
    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const { error, value } = validate(request.body)

  if (error) {
    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const patient = await updatePatient(id, value)

  if (!patient) {
    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  return response.status(200).json(patient)
}

export { updatePatientController }