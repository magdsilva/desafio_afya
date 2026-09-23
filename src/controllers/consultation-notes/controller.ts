import { logger } from '../../config/logger'
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
  logger.info({
    event: 'create_consultation_note.started',
    message: 'Request started: create consultation note',
    user_id: request.userId,
  })

  const { id } = request.params

  const { error: idError } = validateAppointmentId(id)

  if (idError) {
    logger.warn({
      event: 'create_consultation_note.validation_failed',
      message: 'Request rejected: create consultation note (validation failed)',
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
      event: 'create_consultation_note.validation_failed',
      message: 'Request rejected: create consultation note (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

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
    logger.warn({
      event: 'create_consultation_note.not_found',
      message: 'Request rejected: create consultation note (not found)',
      user_id: request.userId,
      status_code: 404,
    })

    return response.status(404).json({
      message: 'Appointment not found'
    })
  }

  logger.info({
    event: 'create_consultation_note.completed',
    message: 'Request completed: create consultation note',
    user_id: request.userId,
    status_code: 201,
  })

  return response.status(201).json(note)
}

export { createConsultationNoteController }