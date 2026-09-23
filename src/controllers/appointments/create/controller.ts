import { logger } from '../../../config/logger'
import { Request, Response } from 'express'

import { createAppointment } from '../../../use-cases/appointments/create-appointment'
import { validate } from './validate'

const createAppointmentController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'create_appointment.started',
    message: 'Request started: create appointment',
    user_id: request.userId,
  })

  const { error, value } = validate(request.body)

  if (error) {
    logger.warn({
      event: 'create_appointment.validation_failed',
      message: 'Request rejected: create appointment (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const { appointment, conflict } = await createAppointment({
    userId: request.userId as string,
    patientId: value.patientId,
    date: value.date,
    time: value.time
  })

  if (conflict) {
    logger.warn({
      event: 'create_appointment.conflict',
      message: 'Request rejected: create appointment (conflict)',
      user_id: request.userId,
      status_code: 409,
    })

    return response.status(409).json({
      message: 'Appointment time is not available'
    })
  }

  if (!appointment) {
    logger.warn({
      event: 'create_appointment.not_found',
      message: 'Request rejected: create appointment (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  logger.info({
    event: 'create_appointment.completed',
    message: 'Request completed: create appointment',
    user_id: request.userId,
    status_code: 201,
  })

  return response.status(201).json(appointment)
}

export { createAppointmentController }