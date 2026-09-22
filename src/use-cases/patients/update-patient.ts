import {
  Patient,
  UpdatePatientInput
} from '../../interfaces/patients'

import {
  updatePatient as updatePatientRepository
} from '../../repositories/patients/update-patient'

const updatePatient = async (
  id: string,
  data: UpdatePatientInput
): Promise<Patient | null> => {
  return updatePatientRepository(id, data)
}

export { updatePatient }