import { validateAppointmentId } from './validate'
import { id } from '../../../__test-support__/fixtures'

describe('validateAppointmentId', () => {
  it('accepts a UUID', () => {
    expect(validateAppointmentId(id)).toEqual({ value: id })
  })

  it.each([undefined, null, '', 'invalid', 123, {}, '11111111-1111-1111'])('rejects invalid id %j', (value) => {
    expect(validateAppointmentId(value).error).toBeDefined()
  })
})
