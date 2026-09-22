import { Request, Response } from 'express'

import { 
  createPatient, 
  getPatientById, 
  getPatients } from '../../use-cases/patients'
  
import { 
  validate, 
  validatePatientId } from './validate'

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

export const getPatientsController = async (
  _request: Request,
  response: Response
): Promise<Response> => {
  const patients = await getPatients()

  return response.status(200).json(patients)
}

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