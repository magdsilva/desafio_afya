import { Patient } from '../../interfaces/patients'
import { getPatients as getPatientsRepository } from '../../repositories/patients/get-patients'

export const getPatients = async (): Promise<Patient[]> => {
  return getPatientsRepository()
}
