import { Router } from 'express'

import {
  createPatientController,
  getPatientsController,
  getPatientByIdController
} from '../controllers/patients/controller'

import { auth } from '../middlewares/auth'

const patientsRoutes = Router()

patientsRoutes.post('/', auth, createPatientController)
patientsRoutes.get('/', auth, getPatientsController)
patientsRoutes.get('/:id', auth, getPatientByIdController)

export { patientsRoutes }