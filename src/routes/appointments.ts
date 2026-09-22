import { Router } from 'express'

import { createAppointmentController } from '../controllers/appointments/create/controller'
import { auth } from '../middlewares/auth'

const appointmentsRoutes = Router()

appointmentsRoutes.post('/', auth, createAppointmentController)

export { appointmentsRoutes }