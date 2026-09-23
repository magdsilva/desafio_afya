import { validate } from './validate'
import { id } from '../../../__test-support__/fixtures'

describe('validate', () => {
  const valid = { patientId: id, date: '2026-10-01', time: '09:30' }

  it('accepts valid input', () => {
    expect(validate(valid)).toEqual({ value: valid })
  })

  it.each([['patientId', 'invalid'], ['patientId', null], ['date', '01/10/2026'], ['date', '2026-1-1'], ['time', '24:00'], ['time', '12:60'], ['time', '9:00'], ['time', '12:00:00']])('rejects invalid %s: %j', (field, value) => {
    const result = validate({ ...valid, [field as string]: value })
    expect(result.error).toBeDefined()
    expect(result.error?.details[0].path).toEqual([field])
  })

  it.each([{}, null, 'invalid', { ...{ patientId: id, date: '2026-10-01', time: '09:30' }, unexpected: true }])('rejects invalid payload %j', (value) => {
    expect(validate(value).error).toBeDefined()
  })

  it.each(Object.keys(valid))('requires %s', (field) => {
    const input: Record<string, unknown> = { ...valid }
    delete input[field]
    const result = validate(input)
    expect(result.error?.details[0].path).toEqual([field])
    expect(result.error?.details[0].type).toBe('any.required')
  })

  it.each(['00:00', '23:59'])('accepts boundary time %s', (time) => {
    expect(validate({ ...valid, time }).error).toBeUndefined()
  })
})
