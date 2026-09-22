import { Router } from 'express'

import { createPatientController } from '../controllers/patients/create/controller'
import { getPatientsController } from '../controllers/patients/list/controller'
import { getPatientByIdController } from '../controllers/patients/details/controller'
import { updatePatientController } from '../controllers/patients/update/controller'
import { deletePatientController } from '../controllers/patients/delete/controller'

import { auth } from '../middlewares/auth'

const patientsRoutes = Router()

patientsRoutes.post('/', auth, createPatientController)
patientsRoutes.get('/', auth, getPatientsController)
patientsRoutes.get('/:id', auth, getPatientByIdController)
patientsRoutes.put('/:id', auth, updatePatientController)
patientsRoutes.delete('/:id', auth, deletePatientController)

export { patientsRoutes }
