import { Router } from 'express'

import { createAppointmentController } from '../controllers/appointments/create/controller'
import { getAppointmentsController } from '../controllers/appointments/list/controller'
import { updateAppointmentController } from '../controllers/appointments/update/controller'
import { deleteAppointmentController } from '../controllers/appointments/delete/controller'

import { auth } from '../middlewares/auth'
import { asyncHandler } from '../helpers/async-handler'
import { createConsultationNoteController } from '../controllers/consultation-notes/controller'

const appointmentsRoutes = Router()

appointmentsRoutes.post(
  '/',
  auth,
  asyncHandler(createAppointmentController)
)

appointmentsRoutes.get(
  '/',
  auth,
  asyncHandler(getAppointmentsController)
)

appointmentsRoutes.put(
  '/:id',
  auth,
  asyncHandler(updateAppointmentController)
)

appointmentsRoutes.delete(
  '/:id',
  auth,
  asyncHandler(deleteAppointmentController)
)

appointmentsRoutes.post(
  '/:id/notes',
  auth,
  asyncHandler(createConsultationNoteController)
)

export { appointmentsRoutes }