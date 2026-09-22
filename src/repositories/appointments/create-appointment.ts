import { DatabaseError } from 'pg'

import { database } from '../../config/database'
import { Appointment } from '../../interfaces/appointments'

interface CreateAppointmentRepositoryInput {
  userId: string
  patientId: string
  scheduledAt: string
}

const createAppointment = async (
  data: CreateAppointmentRepositoryInput
): Promise<Appointment | null> => {
  try {
    const result = await database.query(
      `
        INSERT INTO appointments (
          user_id,
          patient_id,
          scheduled_at
        )
        VALUES ($1, $2, $3)
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
        data.userId,
        data.patientId,
        data.scheduledAt
      ]
    )

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

export { createAppointment }