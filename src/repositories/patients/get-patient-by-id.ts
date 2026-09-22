import { database } from '../../config/database'
import { Patient } from '../../interfaces/patients'

export const getPatientById = async (
  id: string
): Promise<Patient | null> => {
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
      WHERE id = $1
        AND deleted_at IS NULL
      LIMIT 1
    `,
    [id]
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0] as Patient
}
