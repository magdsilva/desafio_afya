import { createPatientController } from './controller'
import { createPatient } from '../../../use-cases/patients/create-patient'
import { validate } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { patientInput, patient } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/patients/create-patient')
jest.mock('./validate')

const createPatientMocked = jest.mocked(createPatient)
const validateMocked = jest.mocked(validate)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = patientInput

beforeEach(() => {
  jest.resetAllMocks()
  createPatientMocked.mockResolvedValue(patient)
  validateMocked.mockReturnValue({ value, error: undefined })
})

describe('Controller - controller', () => {
  it('returns 201 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: { raw: 'input' } })
    const response = createResponse()
    await expect(createPatientController(request, response)).resolves.toBe(response)
    expect(createPatientMocked).toHaveBeenCalledTimes(1)
    expect(createPatientMocked).toHaveBeenCalledWith(value)
    expect(validateMocked).toHaveBeenCalledWith(request.body)
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith(patient)
  })

  it('returns the validation message without calling the use case', async () => {
    validateMocked.mockReturnValue({ value: {}, error: validationError })
    const response = createResponse()
    await createPatientController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' })
    expect(createPatientMocked).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    createPatientMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(createPatientController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
