import { Router } from 'express'

import { createAppointmentController } from '../controllers/appointments/create/controller'
import { getAppointmentsController } from '../controllers/appointments/list/controller'
import { updateAppointmentController } from '../controllers/appointments/update/controller'
import { deleteAppointmentController } from '../controllers/appointments/delete/controller'

import { createConsultationNoteController } from '../controllers/consultation-notes/controller'

import { auth } from '../middlewares/auth'

const appointmentsRoutes = Router()

appointmentsRoutes.post('/', auth, createAppointmentController)
appointmentsRoutes.get('/', auth, getAppointmentsController)
appointmentsRoutes.put('/:id', auth, updateAppointmentController)
appointmentsRoutes.delete('/:id', auth, deleteAppointmentController)

appointmentsRoutes.post(
  '/:id/notes',
  auth,
  createConsultationNoteController
)

export { appointmentsRoutes }