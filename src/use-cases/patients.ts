import { CreatePatientInput, Patient } from '../interfaces/patients'
import {
  createPatient as createPatientRepository,
  getPatients as getPatientsRepository,
  getPatientById as getPatientByIdRepository
} from '../repositories/patients'

export const createPatient = async (
  data: CreatePatientInput
): Promise<Patient> => {
  return createPatientRepository(data)
}

export const getPatients = async (): Promise<Patient[]> => {
  return getPatientsRepository()
}

export const getPatientById = async (
  id: string
): Promise<Patient | null> => {
  return getPatientByIdRepository(id)
}