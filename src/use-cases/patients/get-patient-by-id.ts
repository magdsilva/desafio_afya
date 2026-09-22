import { Patient } from '../../interfaces/patients'
import { getPatientById as getPatientByIdRepository } from '../../repositories/patients/get-patient-by-id'

export const getPatientById = async (
  id: string
): Promise<Patient | null> => {
  return getPatientByIdRepository(id)
}
