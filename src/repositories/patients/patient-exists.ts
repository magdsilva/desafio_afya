import { database } from '../../config/database'

const patientExists = async (
  id: string
): Promise<boolean> => {
  const result = await database.query(
    `
      SELECT 1
      FROM patients
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  )

  return result.rowCount === 1
}

export { patientExists }