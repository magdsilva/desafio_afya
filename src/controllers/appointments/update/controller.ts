import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { updateAppointment } from '../../../use-cases/appointments/update-appointment'
import {
  validate,
  validateAppointmentId
} from './validate'

const updateAppointmentController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'update_appointment.started',
    message: 'Request started: update appointment',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error: idError } = validateAppointmentId(id)

  if (idError) {
    logger.warn({
      event: 'update_appointment.validation_failed',
      message: 'Request rejected: update appointment (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: 'Invalid appointment id'
    })
  }

  const { error, value } = validate(request.body)

  if (error) {
    logger.warn({
      event: 'update_appointment.validation_failed',
      message: 'Request rejected: update appointment (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const { appointment, conflict } = await updateAppointment(
    id,
    request.userId as string,
    value
  )

  if (conflict) {
    logger.warn({
      event: 'update_appointment.conflict',
      message: 'Request rejected: update appointment (conflict)',
      user_id: request.userId,
      status_code: 409,
    })

    return response.status(409).json({
      message: 'Appointment time is not available'
    })
  }

  if (!appointment) {
    logger.warn({
      event: 'update_appointment.not_found',
      message: 'Request rejected: update appointment (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Appointment not found'
    })
  }

  logger.info({
    event: 'update_appointment.completed',
    message: 'Request completed: update appointment',
    user_id: request.userId,
    status_code: 200,
  })

  return response.status(200).json(appointment)
}

export { updateAppointmentController }