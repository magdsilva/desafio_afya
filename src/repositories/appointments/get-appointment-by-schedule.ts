import { database } from '../../config/database'

const getAppointmentBySchedule = async (
    userId: string,
    scheduledAt: string
): Promise<boolean> => {
    const result = await database.query(
        `
      SELECT 1
      FROM appointments
      WHERE user_id = $1
        AND scheduled_at = $2
      LIMIT 1
    `,
        [
            userId,
            scheduledAt
        ]
    )

    return result.rowCount === 1
}

export { getAppointmentBySchedule }