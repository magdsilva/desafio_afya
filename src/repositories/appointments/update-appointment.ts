import { DatabaseError } from 'pg'

import { database } from '../../config/database'
import { Appointment } from '../../interfaces/appointments'

interface UpdateAppointmentRepositoryInput {
  date: string
  time: string
  status: string
}

const updateAppointment = async (
  id: string,
  userId: string,
  data: UpdateAppointmentRepositoryInput
): Promise<Appointment | null> => {
  const scheduledAt = `${data.date}T${data.time}:00`

  try {
    const result = await database.query(
      `
        UPDATE appointments
        SET
          scheduled_at = $3,
          status = $4,
          updated_at = NOW()
        WHERE id = $1
          AND user_id = $2
        RETURNING
          id,
          user_id AS "userId",
          patient_id AS "patientId",
          TO_CHAR(scheduled_at, 'YYYY-MM-DD') AS "date",
          TO_CHAR(scheduled_at, 'HH24:MI') AS "time",
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [
        id,
        userId,
        scheduledAt,
        data.status
      ]
    )

    if (result.rowCount === 0) {
      return null
    }

    return result.rows[0] as Appointment
  } catch (error) {
    if (
      error instanceof DatabaseError &&
      error.code === '23505' &&
      error.constraint === 'unique_user_schedule'
    ) {
      return null
    }

    throw error
  }
}

export { updateAppointment }