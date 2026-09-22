import { Router } from 'express'

import { createPatientController } from '../controllers/patients/create/controller'
import { getPatientsController } from '../controllers/patients/list/controller'
import { getPatientByIdController } from '../controllers/patients/details/controller'

import { auth } from '../middlewares/auth'

const patientsRoutes = Router()

patientsRoutes.post('/', auth, createPatientController)
patientsRoutes.get('/', auth, getPatientsController)
patientsRoutes.get('/:id', auth, getPatientByIdController)

export { patientsRoutes }
