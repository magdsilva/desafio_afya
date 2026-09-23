import { validate } from './validate'

describe('validate', () => {
  const valid = { email: 'doctor@example.com', password: '123456' }

  it('accepts valid input', () => {
    expect(validate(valid)).toEqual({ value: valid })
  })

  it.each([['email', 'invalid'], ['email', ''], ['password', '12345'], ['password', '']])('rejects invalid %s: %j', (field, value) => {
    const result = validate({ ...valid, [field as string]: value })
    expect(result.error).toBeDefined()
    expect(result.error?.details[0].path).toEqual([field])
  })

  it.each([{}, null, 'invalid', { ...{ email: 'doctor@example.com', password: '123456' }, unexpected: true }])('rejects invalid payload %j', (value) => {
    expect(validate(value).error).toBeDefined()
  })

  it.each(Object.keys(valid))('requires %s', (field) => {
    const input: Record<string, unknown> = { ...valid }
    delete input[field]
    const result = validate(input)
    expect(result.error?.details[0].path).toEqual([field])
    expect(result.error?.details[0].type).toBe('any.required')
  })
})
