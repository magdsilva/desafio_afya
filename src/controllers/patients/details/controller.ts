import { Request, Response } from 'express'
import { getPatientById } from '../../../use-cases/patients/get-patient-by-id'
import { validatePatientId } from './validate'

export const getPatientByIdController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params

  const { error } = validatePatientId(id)

  if (error) {
    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const patient = await getPatientById(id)

  if (!patient) {
    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  return response.status(200).json(patient)
}
