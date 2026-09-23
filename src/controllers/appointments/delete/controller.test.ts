import { deleteAppointmentController } from './controller'
import { deleteAppointment } from '../../../use-cases/appointments/delete-appointment'
import { validateAppointmentId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { id, userId } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/appointments/delete-appointment')
jest.mock('./validate')

const deleteAppointmentMocked = jest.mocked(deleteAppointment)
const validateAppointmentIdMocked = jest.mocked(validateAppointmentId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = {}

beforeEach(() => {
  jest.resetAllMocks()
  deleteAppointmentMocked.mockResolvedValue(true)
  validateAppointmentIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('deleteAppointmentController', () => {
  it('returns 204 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: {} })
    const response = createResponse()
    await expect(deleteAppointmentController(request, response)).resolves.toBe(response)
    expect(deleteAppointmentMocked).toHaveBeenCalledTimes(1)
    expect(deleteAppointmentMocked).toHaveBeenCalledWith(id, userId)
    expect(validateAppointmentIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(204)
    expect(response.send).toHaveBeenCalledWith()
    expect(response.json).not.toHaveBeenCalled()
  })

  it('rejects an invalid appointment id before calling the use case', async () => {
    validateAppointmentIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await deleteAppointmentController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid appointment id' })
    expect(deleteAppointmentMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    deleteAppointmentMocked.mockResolvedValue(false)
    const response = createResponse()
    await deleteAppointmentController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Appointment not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    deleteAppointmentMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(deleteAppointmentController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
