import { randomUUID } from 'node:crypto'
import { RequestHandler } from 'express'
import { logger, requestContext } from '../config/logger'

declare global {
  namespace Express {
    interface Request {
      requestId?: string
    }
  }
}

export const requestLogger: RequestHandler = (request, response, next) => {
  const incomingId = request.headers['x-request-id']
  const requestId = typeof incomingId === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(incomingId)
    ? incomingId
    : randomUUID()
  request.requestId = requestId
  response.setHeader('X-Request-Id', requestId)

  requestContext.run({ request_id: requestId }, () => {
    const startedAt = process.hrtime.bigint()
    const fields = { request_id: requestId, method: request.method, path: request.path }
    logger.info('request.started', fields)
    let logged = false
    const complete = (aborted: boolean): void => {
      if (logged) return
      logged = true
      const details = {
        ...fields,
        status_code: response.statusCode,
        duration_ms: Number(process.hrtime.bigint() - startedAt) / 1e6,
      }
      if (aborted) logger.warn('request.aborted', details)
      else if (response.statusCode >= 500) logger.error('request.completed', details)
      else if (response.statusCode >= 400) logger.warn('request.completed', details)
      else logger.info('request.completed', details)
    }
    response.once('finish', () => complete(false))
    response.once('close', () => complete(!response.writableFinished))
    next()
  })
}
