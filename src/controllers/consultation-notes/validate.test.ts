import { validate, validateAppointmentId } from './validate'
import { id } from '../../__test-support__/fixtures'

describe('validateAppointmentId', () => {
  it('accepts a UUID', () => {
    expect(validateAppointmentId(id)).toEqual({ value: id })
  })

  it.each([undefined, null, '', 'invalid', 123, {}, '11111111-1111-1111'])('rejects invalid id %j', (value) => {
    expect(validateAppointmentId(value).error).toBeDefined()
  })
})

describe('validate', () => {
  const valid = { description: 'Consultation note' }

  it('accepts valid input', () => {
    expect(validate(valid)).toEqual({ value: valid })
  })

  it.each([['description', ''], ['description', '   '], ['description', 123], ['description', null]])('rejects invalid %s: %j', (field, value) => {
    const result = validate({ ...valid, [field as string]: value })
    expect(result.error).toBeDefined()
    expect(result.error?.details[0].path).toEqual([field])
  })

  it.each([{}, null, 'invalid', { ...{ description: 'Consultation note' }, unexpected: true }])('rejects invalid payload %j', (value) => {
    expect(validate(value).error).toBeDefined()
  })

  it.each(Object.keys(valid))('requires %s', (field) => {
    const input: Record<string, unknown> = { ...valid }
    delete input[field]
    const result = validate(input)
    expect(result.error?.details[0].path).toEqual([field])
    expect(result.error?.details[0].type).toBe('any.required')
  })

  it('trims the description', () => {
    expect(validate({ description: '  Note  ' })).toEqual({ value: { description: 'Note' } })
  })
})
