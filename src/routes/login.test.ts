import { Router } from 'express'
import { asyncHandler } from '../helpers/async-handler'
import { loginController } from '../controllers/login/controller'

jest.mock('express', () => ({
  Router: jest.fn(() => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() })),
}))
jest.mock('../helpers/async-handler')
jest.mock('../controllers/login/controller')

const RouterMocked = jest.mocked(Router)
const asyncHandlerMocked = jest.mocked(asyncHandler)
const loginControllerMocked = jest.mocked(loginController)

let router: ReturnType<typeof Router>
let exportedRouter: ReturnType<typeof Router>

beforeEach(() => {
  asyncHandlerMocked.mockImplementation(() => jest.fn())
  jest.isolateModules(() => {
    exportedRouter = require('./login').loginRoutes
  })
  router = RouterMocked.mock.results[0].value
})

describe('Route - login', () => {
  it('exports the configured router with all expected endpoints', () => {
    expect(RouterMocked).toHaveBeenCalledTimes(1)
    expect(exportedRouter).toBe(router)
    expect(asyncHandlerMocked).toHaveBeenCalledTimes(1)
    expect(jest.mocked(router.get)).toHaveBeenCalledTimes(0)
    expect(jest.mocked(router.post)).toHaveBeenCalledTimes(1)
    expect(jest.mocked(router.put)).toHaveBeenCalledTimes(0)
    expect(jest.mocked(router.delete)).toHaveBeenCalledTimes(0)
  })

  it('registers POST /', () => {
    expect(asyncHandlerMocked).toHaveBeenNthCalledWith(1, loginControllerMocked)
    const wrappedHandler = asyncHandlerMocked.mock.results[0].value
    expect(jest.mocked(router.post)).toHaveBeenNthCalledWith(1, '/', wrappedHandler)
    expect(loginControllerMocked).not.toHaveBeenCalled()
  })
})
