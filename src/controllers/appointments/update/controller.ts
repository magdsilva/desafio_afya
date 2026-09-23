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
  const { id } = request.params

  const { error: idError } = validateAppointmentId(id)

  if (idError) {
    return response.status(400).json({
      message: 'Invalid appointment id'
    })
  }

  const { error, value } = validate(request.body)

  if (error) {
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
    return response.status(409).json({
      message: 'Appointment time is not available'
    })
  }

  if (!appointment) {
    return response.status(404).json({
      message: 'Appointment not found'
    })
  }

  return response.status(200).json(appointment)
}

export { updateAppointmentController }