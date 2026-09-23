import { Router } from 'express'
import { asyncHandler } from '../helpers/async-handler'
import { auth } from '../middlewares/auth'
import { createPatientController } from '../controllers/patients/create/controller'
import { getPatientsController } from '../controllers/patients/list/controller'
import { getPatientAppointmentHistoryController } from '../controllers/appointments/history/controller'
import { getPatientByIdController } from '../controllers/patients/details/controller'
import { updatePatientController } from '../controllers/patients/update/controller'
import { deletePatientController } from '../controllers/patients/delete/controller'

jest.mock('express', () => ({
  Router: jest.fn(() => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() })),
}))
jest.mock('../helpers/async-handler')
jest.mock('../middlewares/auth')
jest.mock('../controllers/patients/create/controller')
jest.mock('../controllers/patients/list/controller')
jest.mock('../controllers/appointments/history/controller')
jest.mock('../controllers/patients/details/controller')
jest.mock('../controllers/patients/update/controller')
jest.mock('../controllers/patients/delete/controller')

const RouterMocked = jest.mocked(Router)
const asyncHandlerMocked = jest.mocked(asyncHandler)
const createPatientControllerMocked = jest.mocked(createPatientController)
const getPatientsControllerMocked = jest.mocked(getPatientsController)
const getPatientAppointmentHistoryControllerMocked = jest.mocked(getPatientAppointmentHistoryController)
const getPatientByIdControllerMocked = jest.mocked(getPatientByIdController)
const updatePatientControllerMocked = jest.mocked(updatePatientController)
const deletePatientControllerMocked = jest.mocked(deletePatientController)

let router: ReturnType<typeof Router>
let exportedRouter: ReturnType<typeof Router>

beforeEach(() => {
  asyncHandlerMocked.mockImplementation(() => jest.fn())
  jest.isolateModules(() => {
    exportedRouter = require('./patients').patientsRoutes
  })
  router = RouterMocked.mock.results[0].value
})

describe('Route - patients', () => {
  it('exports the configured router with all expected endpoints', () => {
    expect(RouterMocked).toHaveBeenCalledTimes(1)
    expect(exportedRouter).toBe(router)
    expect(asyncHandlerMocked).toHaveBeenCalledTimes(6)
    expect(jest.mocked(router.get)).toHaveBeenCalledTimes(3)
    expect(jest.mocked(router.post)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(router.put)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(router.delete)).toHaveBeenCalledTimes(1)
  })

  it('registers POST / with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(1, createPatientControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[0].value
    expect(jest.mocked(router.post)).toHaveBeenNthCalledWith(1, '/', auth, wrappedHandler)
    expect(createPatientControllerMocked).not.toHaveBeenCalled()
  })

  it('registers GET / with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(2, getPatientsControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[1].value
    expect(jest.mocked(router.get)).toHaveBeenNthCalledWith(1, '/', auth, wrappedHandler)
    expect(getPatientsControllerMocked).not.toHaveBeenCalled()
  })

  it('registers GET /:id/appointments with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(3, getPatientAppointmentHistoryControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[2].value
    expect(jest.mocked(router.get)).toHaveBeenNthCalledWith(2, '/:id/appointments', auth, wrappedHandler)
    expect(getPatientAppointmentHistoryControllerMocked).not.toHaveBeenCalled()
  })

  it('registers GET /:id with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(4, getPatientByIdControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[3].value
    expect(jest.mocked(router.get)).toHaveBeenNthCalledWith(3, '/:id', auth, wrappedHandler)
    expect(getPatientByIdControllerMocked).not.toHaveBeenCalled()
  })

  it('registers PUT /:id with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(5, updatePatientControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[4].value
    expect(jest.mocked(router.put)).toHaveBeenNthCalledWith(1, '/:id', auth, wrappedHandler)
    expect(updatePatientControllerMocked).not.toHaveBeenCalled()
  })

  it('registers DELETE /:id with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(6, deletePatientControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[5].value
    expect(jest.mocked(router.delete)).toHaveBeenNthCalledWith(1, '/:id', auth, wrappedHandler)
    expect(deletePatientControllerMocked).not.toHaveBeenCalled()
  })
})
