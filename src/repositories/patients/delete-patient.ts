import { database } from '../../config/database'

const deletePatient = async (
  id: string
): Promise<boolean> => {
  const result = await database.query(
    `
      UPDATE patients
      SET
        name = 'Paciente anonimizado',
        phone = NULL,
        email = NULL,
        birth_date = NULL,
        gender = NULL,
        height = NULL,
        weight = NULL,
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
        AND deleted_at IS NULL
    `,
    [id]
  )

  return result.rowCount === 1
}

export { deletePatient }