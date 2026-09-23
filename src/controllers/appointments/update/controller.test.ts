import { updateAppointmentController } from './controller'
import { updateAppointment } from '../../../use-cases/appointments/update-appointment'
import { validate, validateAppointmentId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { id, userId, appointment } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/appointments/update-appointment')
jest.mock('./validate')

const updateAppointmentMocked = jest.mocked(updateAppointment)
const validateMocked = jest.mocked(validate)
const validateAppointmentIdMocked = jest.mocked(validateAppointmentId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = { time: '10:00' }

beforeEach(() => {
  jest.resetAllMocks()
  updateAppointmentMocked.mockResolvedValue({ appointment, conflict: false })
  validateMocked.mockReturnValue({ value, error: undefined })
  validateAppointmentIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('updateAppointmentController', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: { raw: 'input' } })
    const response = createResponse()
    await expect(updateAppointmentController(request, response)).resolves.toBe(response)
    expect(updateAppointmentMocked).toHaveBeenCalledTimes(1)
    expect(updateAppointmentMocked).toHaveBeenCalledWith(id, userId, value)
    expect(validateMocked).toHaveBeenCalledWith(request.body)
    expect(validateAppointmentIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(appointment)
  })

  it('rejects an invalid appointment id before calling the use case', async () => {
    validateAppointmentIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await updateAppointmentController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid appointment id' })
    expect(updateAppointmentMocked).not.toHaveBeenCalled()
    expect(validateMocked).not.toHaveBeenCalled()
  })

  it('returns the validation message without calling the use case', async () => {
    validateMocked.mockReturnValue({ value: {}, error: validationError })
    const response = createResponse()
    await updateAppointmentController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' })
    expect(updateAppointmentMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    updateAppointmentMocked.mockResolvedValue({ appointment: null, conflict: false })
    const response = createResponse()
    await updateAppointmentController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Appointment not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('returns 409 for a schedule conflict', async () => {
    updateAppointmentMocked.mockResolvedValue({ appointment: null, conflict: true })
    const response = createResponse()
    await updateAppointmentController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({ message: 'Appointment time is not available' })
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    updateAppointmentMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(updateAppointmentController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
