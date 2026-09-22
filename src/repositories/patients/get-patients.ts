import { database } from '../../config/database'
import { Patient } from '../../interfaces/patients'

export const getPatients = async (): Promise<Patient[]> => {
  const result = await database.query(
    `
      SELECT
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
      FROM patients
      WHERE deleted_at IS NULL
      ORDER BY name
    `
  )

  return result.rows as Patient[]
}
