import {
  ErrorRequestHandler
} from 'express'

const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  console.error(error)

  response.status(500).json({
    message: 'Internal server error'
  })
}

export { errorHandler }
