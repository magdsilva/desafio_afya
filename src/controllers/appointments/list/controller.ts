import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { getAppointments } from '../../../use-cases/appointments/get-appointments'

const getAppointmentsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'get_appointments.started',
    message: 'Request started: get appointments',
    user_id: request.userId,
  })

  const appointments = await getAppointments(
    request.userId as string
  )

  logger.info({
    event: 'get_appointments.completed',
    message: 'Request completed: get appointments',
    user_id: request.userId,
    status_code: 200,
  })

  return response.status(200).json(appointments)
}

export { getAppointmentsController }