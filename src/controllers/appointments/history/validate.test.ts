import { validatePatientId } from './validate'
import { id } from '../../../__test-support__/fixtures'

describe('validatePatientId', () => {
  it('accepts a UUID', () => {
    expect(validatePatientId(id)).toEqual({ value: id })
  })

  it.each([undefined, null, '', 'invalid', 123, {}, '11111111-1111-1111'])('rejects invalid id %j', (value) => {
    expect(validatePatientId(value).error).toBeDefined()
  })
})
