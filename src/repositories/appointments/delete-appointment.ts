import { database } from '../../config/database'

const deleteAppointment = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const result = await database.query(
    `
      DELETE FROM appointments
      WHERE id = $1
        AND user_id = $2
    `,
    [
      id,
      userId
    ]
  )

  return result.rowCount === 1
}

export { deleteAppointment }