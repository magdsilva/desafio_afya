import { Router } from 'express'

import { loginController } from '../controllers/login/controller'
import { asyncHandler } from '../helpers/async-handler'

const loginRoutes = Router()

loginRoutes.post(
  '/',
  asyncHandler(loginController)
)

export { loginRoutes }