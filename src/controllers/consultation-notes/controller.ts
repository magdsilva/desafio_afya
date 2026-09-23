import { Request, Response } from 'express'

import {
  validate,
  validateAppointmentId
} from './validate'
import { createConsultationNote } from '../../use-cases/consultation-notes/create-consultation-note'

const createConsultationNoteController = async (
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

  const note = await createConsultationNote(
    id,
    request.userId as string,
    value.description
  )

  if (!note) {
    return response.status(404).json({
      message: 'Appointment not found'
    })
  }

  return response.status(201).json(note)
}

export { createConsultationNoteController }