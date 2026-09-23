import { Request, Response } from 'express'

import { getAppointments } from '../../../use-cases/appointments/get-appointments'

const getAppointmentsController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const appointments = await getAppointments(
    request.userId as string
  )

  return response.status(200).json(appointments)
}

export { getAppointmentsController }