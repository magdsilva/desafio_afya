import { Router } from 'express'

import { createAppointmentController } from '../controllers/appointments/create/controller'
import { getAppointmentsController } from '../controllers/appointments/list/controller'
import { auth } from '../middlewares/auth'

const appointmentsRoutes = Router()

appointmentsRoutes.post('/', auth, createAppointmentController)
appointmentsRoutes.get('/', auth, getAppointmentsController)

export { appointmentsRoutes }