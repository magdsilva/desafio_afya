import {
  deletePatient as deletePatientRepository
} from '../../repositories/patients/delete-patient'

const deletePatient = async (
  id: string
): Promise<boolean> => {
  return deletePatientRepository(id)
}

export { deletePatient }