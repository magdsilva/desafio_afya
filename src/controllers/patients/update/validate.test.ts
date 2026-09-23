import { validate, validatePatientId } from './validate'
import { id, patientInput } from '../../../__test-support__/fixtures'

describe('validatePatientId', () => {
  it('accepts a UUID', () => {
    expect(validatePatientId(id)).toEqual({ value: id })
  })

  it.each([undefined, null, '', 'invalid', 123, {}, '11111111-1111-1111'])('rejects invalid id %j', (value) => {
    expect(validatePatientId(value).error).toBeDefined()
  })
})

describe('validate', () => {
  const valid = patientInput

  it('accepts valid input', () => {
    expect(validate(valid)).toEqual({ value: valid })
  })

  it.each([['name', ''], ['name', 'a'.repeat(151)], ['phone', ''], ['phone', '1'.repeat(31)], ['email', 'invalid'], ['email', 'a'.repeat(250) + '@example.com'], ['birthDate', '12/05/1990'], ['gender', 'a'.repeat(21)], ['heightCm', 0], ['heightCm', -1], ['heightCm', 1.5], ['heightCm', 'invalid'], ['weightGrams', 0], ['weightGrams', -1], ['weightGrams', 1.5], ['weightGrams', 'invalid']])('rejects invalid %s: %j', (field, value) => {
    const result = validate({ ...valid, [field as string]: value })
    expect(result.error).toBeDefined()
    expect(result.error?.details[0].path).toEqual([field])
  })

  it.each([{}, null, 'invalid', { ...patientInput, unexpected: true }])('rejects invalid payload %j', (value) => {
    expect(validate(value).error).toBeDefined()
  })

  it.each(Object.entries(valid))('accepts a partial update of %s', (field, value) => {
    expect(validate({ [field]: value }).error).toBeUndefined()
  })

  it('converts numeric measurements to integers', () => {
    const result = validate({ ...valid, heightCm: '165', weightGrams: '60000' })
    expect(result.error).toBeUndefined()
    expect(result.value).toEqual({ ...valid, heightCm: 165, weightGrams: 60000 })
  })

  it('accepts maximum name, phone and gender lengths', () => {
    expect(validate({ ...valid, name: 'a'.repeat(150), phone: '1'.repeat(30), gender: 'a'.repeat(20) }).error).toBeUndefined()
  })
})
