import { Request, Response } from 'express'

import { createAppointment } from '../../../use-cases/appointments/create-appointment'
import { validate } from './validate'

const createAppointmentController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { error, value } = validate(request.body)

  if (error) {
    return response.status(400).json({
      message: error.details[0].message
    })
  }

  const userId =  request.userId as string

  const appointment = await createAppointment({
    userId,
    patientId: value.patientId,
    date: value.date,
    time: value.time
  })

  if (!appointment) {
    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  return response.status(201).json(appointment)
}

export { createAppointmentController }