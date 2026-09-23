import { database } from '../../config/database'
import { PatientAppointmentHistory } from '../../interfaces/appointments'

const getPatientAppointmentHistory = async (
  patientId: string,
  userId: string
): Promise<PatientAppointmentHistory[]> => {
  const result = await database.query(
    `
      SELECT
        a.id,
        a.patient_id AS "patientId",
        TO_CHAR(a.scheduled_at, 'YYYY-MM-DD') AS "date",
        TO_CHAR(a.scheduled_at, 'HH24:MI') AS "time",
        a.status,
        a.created_at AS "createdAt",
        a.updated_at AS "updatedAt",
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', cn.id,
              'appointmentId', cn.appointment_id,
              'description', cn.description,
              'createdAt', cn.created_at,
              'updatedAt', cn.updated_at
            )
            ORDER BY cn.created_at ASC
          ) FILTER (WHERE cn.id IS NOT NULL),
          '[]'::json
        ) AS notes
      FROM appointments a
      LEFT JOIN consultation_notes cn
        ON cn.appointment_id = a.id
      WHERE a.patient_id = $1
        AND a.user_id = $2
      GROUP BY a.id
      ORDER BY a.scheduled_at DESC
    `,
    [
      patientId,
      userId
    ]
  )

  return result.rows as PatientAppointmentHistory[]
}

export { getPatientAppointmentHistory }