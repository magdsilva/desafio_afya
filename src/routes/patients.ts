import { Router } from 'express'

import { createPatientController } from '../controllers/patients/controller'
import { auth } from '../middlewares/auth'

const patientsRoutes = Router()

patientsRoutes.post('/', auth, createPatientController)

export { patientsRoutes }