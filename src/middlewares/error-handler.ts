import {
  ErrorRequestHandler
} from 'express'
import { errorDetails, logger } from '../config/logger'

const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  logger.error('request.failed', {
    request_id: request.requestId,
    error: errorDetails(error),
  })

  if (response.headersSent) {
    _next(error)
    return
  }

  response.status(500).json({
    message: 'Internal server error'
  })
}

export { errorHandler }
