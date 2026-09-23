import { createAppointmentController } from './controller'
import { createAppointment } from '../../../use-cases/appointments/create-appointment'
import { validate } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { userId, appointmentInput, appointment } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/appointments/create-appointment')
jest.mock('./validate')

const createAppointmentMocked = jest.mocked(createAppointment)
const validateMocked = jest.mocked(validate)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = appointmentInput

beforeEach(() => {
  jest.resetAllMocks()
  createAppointmentMocked.mockResolvedValue({ appointment, conflict: false })
  validateMocked.mockReturnValue({ value, error: undefined })
})

describe('createAppointmentController', () => {
  it('returns 201 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: { raw: 'input' } })
    const response = createResponse()
    await expect(createAppointmentController(request, response)).resolves.toBe(response)
    expect(createAppointmentMocked).toHaveBeenCalledTimes(1)
    expect(createAppointmentMocked).toHaveBeenCalledWith({ userId, patientId: value.patientId, date: value.date, time: value.time })
    expect(validateMocked).toHaveBeenCalledWith(request.body)
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith(appointment)
  })

  it('returns the validation message without calling the use case', async () => {
    validateMocked.mockReturnValue({ value: {}, error: validationError })
    const response = createResponse()
    await createAppointmentController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' })
    expect(createAppointmentMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    createAppointmentMocked.mockResolvedValue({ appointment: null, conflict: false })
    const response = createResponse()
    await createAppointmentController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Patient not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('returns 409 for a schedule conflict', async () => {
    createAppointmentMocked.mockResolvedValue({ appointment: null, conflict: true })
    const response = createResponse()
    await createAppointmentController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({ message: 'Appointment time is not available' })
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    createAppointmentMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(createAppointmentController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
