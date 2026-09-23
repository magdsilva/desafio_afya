import { getPatientAppointmentHistoryController } from './controller'
import { getPatientAppointmentHistory } from '../../../use-cases/appointments/get-patient-appointment-history'
import { validatePatientId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { id, userId, history } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/appointments/get-patient-appointment-history')
jest.mock('./validate')

const getPatientAppointmentHistoryMocked = jest.mocked(getPatientAppointmentHistory)
const validatePatientIdMocked = jest.mocked(validatePatientId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = {}

beforeEach(() => {
  jest.resetAllMocks()
  getPatientAppointmentHistoryMocked.mockResolvedValue({ history, patientFound: true })
  validatePatientIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('Controller - controller', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: {} })
    const response = createResponse()
    await expect(getPatientAppointmentHistoryController(request, response)).resolves.toBe(response)
    expect(getPatientAppointmentHistoryMocked).toHaveBeenCalledTimes(1)
    expect(getPatientAppointmentHistoryMocked).toHaveBeenCalledWith(id, userId)
    expect(validatePatientIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(history)
  })

  it('rejects an invalid patient id before calling the use case', async () => {
    validatePatientIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await getPatientAppointmentHistoryController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid patient id' })
    expect(getPatientAppointmentHistoryMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    getPatientAppointmentHistoryMocked.mockResolvedValue({ history: [], patientFound: false })
    const response = createResponse()
    await getPatientAppointmentHistoryController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Patient not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    getPatientAppointmentHistoryMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(getPatientAppointmentHistoryController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })

  it('returns 200 for an empty list', async () => {
    getPatientAppointmentHistoryMocked.mockResolvedValue({ history: [], patientFound: true })
    const response = createResponse()
    await getPatientAppointmentHistoryController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith([])
  })
})
