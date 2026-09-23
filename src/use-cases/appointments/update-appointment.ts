import {
    Appointment,
    UpdateAppointmentInput
} from '../../interfaces/appointments'

import { getAppointmentById } from '../../repositories/appointments/get-appointment-by-id'
import { getAppointmentBySchedule } from '../../repositories/appointments/get-appointment-by-schedule'
import {
    updateAppointment as updateAppointmentRepository
} from '../../repositories/appointments/update-appointment'

interface UpdateAppointmentResult {
    appointment: Appointment | null
    conflict: boolean
}

const updateAppointment = async (
    id: string,
    userId: string,
    data: UpdateAppointmentInput
): Promise<UpdateAppointmentResult> => {
    const currentAppointment = await getAppointmentById(
        id,
        userId
    )

    if (!currentAppointment) {
        return {
            appointment: null,
            conflict: false
        }
    }

    const date = data.date ?? currentAppointment.date
    const time = data.time ?? currentAppointment.time
    const status = data.status ?? currentAppointment.status

    const scheduleChanged =
        date !== currentAppointment.date ||
        time !== currentAppointment.time

    if (scheduleChanged) {
        const scheduledAt = `${date}T${time}:00`

        const scheduleConflict = await getAppointmentBySchedule(
            userId,
            scheduledAt
        )

        if (scheduleConflict) {
            return {
                appointment: null,
                conflict: true
            }
        }
    }

    const appointment = await updateAppointmentRepository(
        id,
        userId,
        {
            date,
            time,
            status
        }
    )

    if (!appointment) {
        return {
            appointment: null,
            conflict: true
        }
    }

    return {
        appointment,
        conflict: false
    }
}

export { updateAppointment }