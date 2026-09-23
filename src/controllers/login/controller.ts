import { logger } from '../../config/logger'
import { Request, Response } from 'express'

import { login } from '../../use-cases/login'
import { validate } from './validate'

export const loginController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  logger.info({
    event: 'login.started',
    message: 'Request started: login',
    user_id: request.userId,
  })

  const { error, value } = validate(request.body)

  if (error) {
    logger.warn({
      event: 'login.validation_failed',
      message: 'Request rejected: login (validation failed)',
      user_id: request.userId,
      status_code: 400,
    })

    return response.status(400).json({
      message: error.details[0].message
    })
  }

  try {
    const result = await login({
      email: value.email,
      password: value.password
    })

    logger.info({
      event: 'login.completed',
      message: 'Request completed: login',
      user_id: request.userId,
      status_code: 200,
    })

    return response.status(200).json(result)
  } catch {
    logger.warn({
      event: 'login.unauthorized',
      message: 'Request rejected: login (unauthorized)',
      user_id: request.userId,
      status_code: 401,
    })

    return response.status(401).json({
      message: 'Invalid email or password'
    })
  }
}