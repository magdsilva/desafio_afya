import { Request, Response } from 'express'

import { deletePatient } from '../../../use-cases/patients/delete-patient'
import { validatePatientId } from './validate'

const deletePatientController = async (
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

  const deleted = await deletePatient(id)

  if (!deleted) {
    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  return response.status(204).send()
}

export { deletePatientController }