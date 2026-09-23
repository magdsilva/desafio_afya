import { Router } from 'express'

import { createPatientController } from '../controllers/patients/create/controller'
import { deletePatientController } from '../controllers/patients/delete/controller'
import { getPatientByIdController } from '../controllers/patients/details/controller'
import { getPatientAppointmentHistoryController } from '../controllers/appointments/history/controller'
import { getPatientsController } from '../controllers/patients/list/controller'
import { updatePatientController } from '../controllers/patients/update/controller'

import { asyncHandler } from '../helpers/async-handler'
import { auth } from '../middlewares/auth'

const patientsRoutes = Router()

patientsRoutes.post(
  '/',
  auth,
  asyncHandler(createPatientController)
)

patientsRoutes.get(
  '/',
  auth,
  asyncHandler(getPatientsController)
)

patientsRoutes.get(
  '/:id/appointments',
  auth,
  asyncHandler(getPatientAppointmentHistoryController)
)

patientsRoutes.get(
  '/:id',
  auth,
  asyncHandler(getPatientByIdController)
)

patientsRoutes.put(
  '/:id',
  auth,
  asyncHandler(updatePatientController)
)

patientsRoutes.delete(
  '/:id',
  auth,
  asyncHandler(deletePatientController)
)

export { patientsRoutes }