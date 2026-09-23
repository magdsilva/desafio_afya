import { deletePatientController } from './controller'
import { deletePatient } from '../../../use-cases/patients/delete-patient'
import { validatePatientId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { id } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/patients/delete-patient')
jest.mock('./validate')

const deletePatientMocked = jest.mocked(deletePatient)
const validatePatientIdMocked = jest.mocked(validatePatientId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = {}

beforeEach(() => {
  jest.resetAllMocks()
  deletePatientMocked.mockResolvedValue(true)
  validatePatientIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('deletePatientController', () => {
  it('returns 204 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: {} })
    const response = createResponse()
    await expect(deletePatientController(request, response)).resolves.toBe(response)
    expect(deletePatientMocked).toHaveBeenCalledTimes(1)
    expect(deletePatientMocked).toHaveBeenCalledWith(id)
    expect(validatePatientIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(204)
    expect(response.send).toHaveBeenCalledWith()
    expect(response.json).not.toHaveBeenCalled()
  })

  it('rejects an invalid patient id before calling the use case', async () => {
    validatePatientIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await deletePatientController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid patient id' })
    expect(deletePatientMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    deletePatientMocked.mockResolvedValue(false)
    const response = createResponse()
    await deletePatientController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Patient not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    deletePatientMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(deletePatientController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
