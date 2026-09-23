import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { deleteAppointment } from '../../../use-cases/appointments/delete-appointment'
import { validateAppointmentId } from './validate'

const deleteAppointmentController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'delete_appointment.started',
    message: 'Request started: delete appointment',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error } = validateAppointmentId(id)

  if (error) {
    logger.warn({
      event: 'delete_appointment.validation_failed',
      message: 'Request rejected: delete appointment (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: 'Invalid appointment id'
    })
  }

  const deleted = await deleteAppointment(
    id,
    request.userId as string
  )

  if (!deleted) {
    logger.warn({
      event: 'delete_appointment.not_found',
      message: 'Request rejected: delete appointment (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Appointment not found'
    })
  }

  logger.info({
    event: 'delete_appointment.completed',
    message: 'Request completed: delete appointment',
    user_id: request.userId,
    status_code: 204,
  })

  return response.status(204).send()
}

export { deleteAppointmentController }