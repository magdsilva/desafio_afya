import { AsyncLocalStorage } from 'node:async_hooks'

export const requestContext = new AsyncLocalStorage<{ request_id: string }>()

type Level = 'info' | 'warn' | 'error'
type LogEntry = { message: string, event?: string } & Record<string, unknown>

const write = (level: Level, input: string | LogEntry, fields: Record<string, unknown> = {}): void => {
  const details: Record<string, unknown> = typeof input === 'string' ? { ...fields, event: input } : input
  const entry = JSON.stringify({
    ...details,
    timestamp: new Date().toISOString(),
    level,
    request_id: requestContext.getStore()?.request_id ?? details.request_id,
  })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.log(entry)
}

export const errorDetails = (error: unknown): Record<string, unknown> => {
  if (!(error instanceof Error)) return { name: 'UnknownError' }
  return { name: error.name, message: error.message, stack: error.stack }
}

export const logger = {
  info: (entry: string | LogEntry, fields?: Record<string, unknown>): void => write('info', entry, fields),
  warn: (entry: string | LogEntry, fields?: Record<string, unknown>): void => write('warn', entry, fields),
  error: (entry: string | LogEntry, fields?: Record<string, unknown>): void => write('error', entry, fields),
}
