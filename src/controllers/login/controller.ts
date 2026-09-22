import { Request, Response } from 'express'

import { login } from '../../use-cases/login'
import { validate } from './validate'

export const loginController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { error, value } = validate(request.body)

  if (error) {
    return response.status(400).json({
      message: error.details[0].message
    })
  }

  try {
    const result = await login({
      email: value.email,
      password: value.password
    })

    return response.status(200).json(result)
  } catch {
    return response.status(401).json({
      message: 'Invalid email or password'
    })
  }
}