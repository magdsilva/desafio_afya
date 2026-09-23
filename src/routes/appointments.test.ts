import { Router } from 'express'
import { asyncHandler } from '../helpers/async-handler'
import { auth } from '../middlewares/auth'
import { createAppointmentController } from '../controllers/appointments/create/controller'
import { getAppointmentsController } from '../controllers/appointments/list/controller'
import { updateAppointmentController } from '../controllers/appointments/update/controller'
import { deleteAppointmentController } from '../controllers/appointments/delete/controller'
import { createConsultationNoteController } from '../controllers/consultation-notes/controller'

jest.mock('express', () => ({
  Router: jest.fn(() => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() })),
}))
jest.mock('../helpers/async-handler')
jest.mock('../middlewares/auth')
jest.mock('../controllers/appointments/create/controller')
jest.mock('../controllers/appointments/list/controller')
jest.mock('../controllers/appointments/update/controller')
jest.mock('../controllers/appointments/delete/controller')
jest.mock('../controllers/consultation-notes/controller')

const RouterMocked = jest.mocked(Router)
const asyncHandlerMocked = jest.mocked(asyncHandler)
const createAppointmentControllerMocked = jest.mocked(createAppointmentController)
const getAppointmentsControllerMocked = jest.mocked(getAppointmentsController)
const updateAppointmentControllerMocked = jest.mocked(updateAppointmentController)
const deleteAppointmentControllerMocked = jest.mocked(deleteAppointmentController)
const createConsultationNoteControllerMocked = jest.mocked(createConsultationNoteController)

let router: ReturnType<typeof Router>
let exportedRouter: ReturnType<typeof Router>

beforeEach(() => {
  asyncHandlerMocked.mockImplementation(() => jest.fn())
  jest.isolateModules(() => {
    exportedRouter = require('./appointments').appointmentsRoutes
  })
  router = RouterMocked.mock.results[0].value
})

describe('Route - appointments', () => {
  it('exports the configured router with all expected endpoints', () => {
    expect(RouterMocked).toHaveBeenCalledTimes(1)
    expect(exportedRouter).toBe(router)
    expect(asyncHandlerMocked).toHaveBeenCalledTimes(5)
    expect(jest.mocked(router.get)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(router.post)).toHaveBeenCalledTimes(2)
    expect(jest.mocked(router.put)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(router.delete)).toHaveBeenCalledTimes(1)
  })

  it('registers POST / with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(1, createAppointmentControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[0].value
    expect(jest.mocked(router.post)).toHaveBeenNthCalledWith(1, '/', auth, wrappedHandler)
    expect(createAppointmentControllerMocked).not.toHaveBeenCalled()
  })

  it('registers GET / with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(2, getAppointmentsControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[1].value
    expect(jest.mocked(router.get)).toHaveBeenNthCalledWith(1, '/', auth, wrappedHandler)
    expect(getAppointmentsControllerMocked).not.toHaveBeenCalled()
  })

  it('registers PUT /:id with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(3, updateAppointmentControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[2].value
    expect(jest.mocked(router.put)).toHaveBeenNthCalledWith(1, '/:id', auth, wrappedHandler)
    expect(updateAppointmentControllerMocked).not.toHaveBeenCalled()
  })

  it('registers DELETE /:id with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(4, deleteAppointmentControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[3].value
    expect(jest.mocked(router.delete)).toHaveBeenNthCalledWith(1, '/:id', auth, wrappedHandler)
    expect(deleteAppointmentControllerMocked).not.toHaveBeenCalled()
  })

  it('registers POST /:id/notes with authentication before the controller', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(5, createConsultationNoteControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[4].value
    expect(jest.mocked(router.post)).toHaveBeenNthCalledWith(2, '/:id/notes', auth, wrappedHandler)
    expect(createConsultationNoteControllerMocked).not.toHaveBeenCalled()
  })
})
