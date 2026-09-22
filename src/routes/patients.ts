import { Router } from 'express'

import { createPatientController, getPatientsController } from '../controllers/patients/controller'
import { auth } from '../middlewares/auth'

const patientsRoutes = Router()

patientsRoutes.post('/', auth, createPatientController)
patientsRoutes.get('/', auth, getPatientsController)

export { patientsRoutes }