import { Request, Response } from 'express'

import { getPatientAppointmentHistory } from '../../../use-cases/appointments/get-patient-appointment-history'
import { validatePatientId } from './validate'

const getPatientAppointmentHistoryController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params

  const { error } = validatePatientId(id)

  if (error) {
    return response.status(400).json({
      message: 'Invalid patient id'
    })
  }

  const { history, patientFound } =
    await getPatientAppointmentHistory(
      id,
      request.userId as string
    )

  if (!patientFound) {
    return response.status(404).json({
      message: 'Patient not found'
    })
  }

  return response.status(200).json(history)
}

export { getPatientAppointmentHistoryController }