import { Request, Response } from 'express'

import { deleteAppointment } from '../../../use-cases/appointments/delete-appointment'
import { validateAppointmentId } from './validate'

const deleteAppointmentController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params

  const { error } = validateAppointmentId(id)

  if (error) {
    return response.status(400).json({
      message: 'Invalid appointment id'
    })
  }

  const deleted = await deleteAppointment(
    id,
    request.userId as string
  )

  if (!deleted) {
    return response.status(404).json({
      message: 'Appointment not found'
    })
  }

  return response.status(204).send()
}

export { deleteAppointmentController }