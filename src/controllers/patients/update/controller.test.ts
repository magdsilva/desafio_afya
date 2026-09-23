import { updatePatientController } from './controller'
import { updatePatient } from '../../../use-cases/patients/update-patient'
import { validate, validatePatientId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { id, patient } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/patients/update-patient')
jest.mock('./validate')

const updatePatientMocked = jest.mocked(updatePatient)
const validateMocked = jest.mocked(validate)
const validatePatientIdMocked = jest.mocked(validatePatientId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = { name: "Updated" }

beforeEach(() => {
  jest.resetAllMocks()
  updatePatientMocked.mockResolvedValue(patient)
  validateMocked.mockReturnValue({ value, error: undefined })
  validatePatientIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('updatePatientController', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: { raw: 'input' } })
    const response = createResponse()
    await expect(updatePatientController(request, response)).resolves.toBe(response)
    expect(updatePatientMocked).toHaveBeenCalledTimes(1)
    expect(updatePatientMocked).toHaveBeenCalledWith(id, value)
    expect(validateMocked).toHaveBeenCalledWith(request.body)
    expect(validatePatientIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(patient)
  })

  it('rejects an invalid patient id before calling the use case', async () => {
    validatePatientIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await updatePatientController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid patient id' })
    expect(updatePatientMocked).not.toHaveBeenCalled()
    expect(validateMocked).not.toHaveBeenCalled()
  })

  it('returns the validation message without calling the use case', async () => {
    validateMocked.mockReturnValue({ value: {}, error: validationError })
    const response = createResponse()
    await updatePatientController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' })
    expect(updatePatientMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    updatePatientMocked.mockResolvedValue(null)
    const response = createResponse()
    await updatePatientController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Patient not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    updatePatientMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(updatePatientController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
