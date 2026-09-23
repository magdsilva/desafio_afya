import { database } from '../../config/database'
import { Appointment } from '../../interfaces/appointments'

const getAppointments = async (
  userId: string
): Promise<Appointment[]> => {
  const result = await database.query(
    `
      SELECT
        id,
        user_id AS "userId",
        patient_id AS "patientId",
        TO_CHAR(scheduled_at, 'YYYY-MM-DD') AS "date",
        TO_CHAR(scheduled_at, 'HH24:MI') AS "time",
        status,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM appointments
      WHERE user_id = $1
      ORDER BY scheduled_at ASC
    `,
    [userId]
  )

  return result.rows as Appointment[]
}

export { getAppointments }