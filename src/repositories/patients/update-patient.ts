import { database } from '../../config/database'
import { Patient, UpdatePatientInput } from '../../interfaces/patients'

const updatePatient = async (
  id: string,
  patient: UpdatePatientInput
): Promise<Patient | null> => {
  const result = await database.query(
    `
      UPDATE patients
      SET
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        birth_date = COALESCE($5, birth_date),
        gender = COALESCE($6, gender),
        height = COALESCE($7, height),
        weight = COALESCE($8, weight),
        updated_at = NOW()
      WHERE id = $1
        AND deleted_at IS NULL
      RETURNING
        id,
        name,
        phone,
        email,
        TO_CHAR(birth_date, 'YYYY-MM-DD') AS "birthDate",
        gender,
        height AS "heightCm",
        weight AS "weightGrams",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      id,
      patient.name ?? null,
      patient.phone ?? null,
      patient.email ?? null,
      patient.birthDate ?? null,
      patient.gender ?? null,
      patient.heightCm ?? null,
      patient.weightGrams ?? null
    ]
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0] as Patient
}

export { updatePatient }