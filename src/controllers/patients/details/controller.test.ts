import { getPatientByIdController } from './controller'
import { getPatientById } from '../../../use-cases/patients/get-patient-by-id'
import { validatePatientId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { id, patient } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/patients/get-patient-by-id')
jest.mock('./validate')

const getPatientByIdMocked = jest.mocked(getPatientById)
const validatePatientIdMocked = jest.mocked(validatePatientId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = {}

beforeEach(() => {
  jest.resetAllMocks()
  getPatientByIdMocked.mockResolvedValue(patient)
  validatePatientIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('getPatientByIdController', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: {} })
    const response = createResponse()
    await expect(getPatientByIdController(request, response)).resolves.toBe(response)
    expect(getPatientByIdMocked).toHaveBeenCalledTimes(1)
    expect(getPatientByIdMocked).toHaveBeenCalledWith(id)
    expect(validatePatientIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(patient)
  })

  it('rejects an invalid patient id before calling the use case', async () => {
    validatePatientIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await getPatientByIdController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid patient id' })
    expect(getPatientByIdMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    getPatientByIdMocked.mockResolvedValue(null)
    const response = createResponse()
    await getPatientByIdController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Patient not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    getPatientByIdMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(getPatientByIdController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
