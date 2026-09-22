import {
  CreatePatientInput,
  Patient
} from '../interfaces/patients'

import { createPatient as createPatientRepository } from '../repositories/patients'

export const createPatient = async (
  data: CreatePatientInput
): Promise<Patient> => {
  return createPatientRepository(data)
}