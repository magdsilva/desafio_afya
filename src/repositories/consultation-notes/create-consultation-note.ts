import { database } from '../../config/database'
import { ConsultationNote } from '../../interfaces/consultation-notes'

const createConsultationNote = async (
  appointmentId: string,
  description: string
): Promise<ConsultationNote> => {
  const result = await database.query(
    `
      INSERT INTO consultation_notes (
        appointment_id,
        description
      )
      VALUES ($1, $2)
      RETURNING
        id,
        appointment_id AS "appointmentId",
        description,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      appointmentId,
      description
    ]
  )

  return result.rows[0] as ConsultationNote
}

export { createConsultationNote }