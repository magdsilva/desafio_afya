import { errorDetails, logger, requestContext } from './logger'

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('Config - logger', () => {
  it.each(['info', 'warn', 'error'] as const)('supports structured objects at level %s', (level) => {
    const entry = { message: 'Fetching patient appointment history', user_id: 'user-123' }
    requestContext.run({ request_id: 'request-123' }, () => logger[level](entry))
    const output = level === 'info' ? console.log : console[level]
    expect(JSON.parse(jest.mocked(output).mock.calls[0][0])).toEqual({
      ...entry, level, request_id: 'request-123', timestamp: expect.any(String),
    })
    expect(entry).toEqual({ message: 'Fetching patient appointment history', user_id: 'user-123' })
  })

  it('preserves legacy event calls and fields', () => {
    logger.info('server.started', { port: 3000 })
    expect(JSON.parse(jest.mocked(console.log).mock.calls[0][0])).toMatchObject({
      event: 'server.started', port: 3000, level: 'info',
    })
  })

  it('uses the active context ID and protects generated fields from overrides', () => {
    requestContext.run({ request_id: 'actual-id' }, () => {
      logger.info({ message: 'Operation completed', event: 'operation.completed',
        request_id: 'wrong-id', level: 'error', timestamp: 'wrong-time' })
    })
    const entry = JSON.parse(jest.mocked(console.log).mock.calls[0][0])
    expect(entry).toMatchObject({ request_id: 'actual-id', level: 'info', event: 'operation.completed' })
    expect(Number.isNaN(Date.parse(entry.timestamp))).toBe(false)
  })

  it('keeps explicit correlation outside request context and escapes newlines', () => {
    logger.warn({ message: 'First line\nSecond line', request_id: 'external-id' })
    const output = jest.mocked(console.warn).mock.calls[0][0]
    expect(output).not.toContain('\n')
    expect(JSON.parse(output)).toMatchObject({ message: 'First line\nSecond line', request_id: 'external-id' })
  })

  it('serializes errors without copying arbitrary properties', () => {
    const error = Object.assign(new Error('Failure'), { password: 'secret' })
    expect(errorDetails(error)).toEqual({ name: 'Error', message: 'Failure', stack: error.stack })
    expect(errorDetails({ password: 'secret' })).toEqual({ name: 'UnknownError' })
  })
})
