import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const auth = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const authorization = request.headers.authorization

  if (!authorization) {
    response.status(401).json({
      message: 'Token not provided'
    })

    return
  }

  const [type, token] = authorization.split(' ')

  if (type !== 'Bearer' || !token) {
    response.status(401).json({
      message: 'Invalid token'
    })

    return
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    response.status(500).json({
      message: 'JWT secret is not configured'
    })

    return
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload

    request.userId = decoded.sub as string

    next()
  } catch {
    response.status(401).json({
      message: 'Invalid token'
    })
  }
}