import { database } from '../../config/database'
import { Appointment } from '../../interfaces/appointments'

const getAppointmentById = async (
  id: string,
  userId: string
): Promise<Appointment | null> => {
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
      WHERE id = $1
        AND user_id = $2
    `,
    [id, userId]
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0] as Appointment
}

export { getAppointmentById }