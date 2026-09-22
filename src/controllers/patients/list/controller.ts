import { Request, Response } from 'express'
import { getPatients } from '../../../use-cases/patients/get-patients'

export const getPatientsController = async (
  _request: Request,
  response: Response
): Promise<Response> => {
  const patients = await getPatients()

  return response.status(200).json(patients)
}
