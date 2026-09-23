import { createConsultationNoteController } from './controller'
import { createConsultationNote } from '../../use-cases/consultation-notes/create-consultation-note'
import { validate, validateAppointmentId } from './validate'
import { ValidationError } from 'joi'
import { createRequest, createResponse } from '../../__test-support__/http'
import { id, userId, note } from '../../__test-support__/fixtures'

jest.mock('../../use-cases/consultation-notes/create-consultation-note')
jest.mock('./validate')

const createConsultationNoteMocked = jest.mocked(createConsultationNote)
const validateMocked = jest.mocked(validate)
const validateAppointmentIdMocked = jest.mocked(validateAppointmentId)
const validationError = new ValidationError('Invalid input', [{ message: 'Invalid input', path: [], type: 'any.invalid' }], {})
const value = { description: note.description }

beforeEach(() => {
  jest.resetAllMocks()
  createConsultationNoteMocked.mockResolvedValue(note)
  validateMocked.mockReturnValue({ value, error: undefined })
  validateAppointmentIdMocked.mockReturnValue({ value: id, error: undefined })
})

describe('createConsultationNoteController', () => {
  it('returns 201 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: { raw: 'input' } })
    const response = createResponse()
    await expect(createConsultationNoteController(request, response)).resolves.toBe(response)
    expect(createConsultationNoteMocked).toHaveBeenCalledTimes(1)
    expect(createConsultationNoteMocked).toHaveBeenCalledWith(id, userId, value.description)
    expect(validateMocked).toHaveBeenCalledWith(request.body)
    expect(validateAppointmentIdMocked).toHaveBeenCalledWith(id)
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith(note)
  })

  it('rejects an invalid appointment id before calling the use case', async () => {
    validateAppointmentIdMocked.mockReturnValue({ value: 'invalid', error: validationError })
    const response = createResponse()
    await createConsultationNoteController(createRequest({ params: { id: 'invalid' } }), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid appointment id' })
    expect(createConsultationNoteMocked).not.toHaveBeenCalled()
    expect(validateMocked).not.toHaveBeenCalled()
  })

  it('returns the validation message without calling the use case', async () => {
    validateMocked.mockReturnValue({ value: {}, error: validationError })
    const response = createResponse()
    await createConsultationNoteController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Invalid input' })
    expect(createConsultationNoteMocked).not.toHaveBeenCalled()
  })

  it('returns 404 when the resource does not exist', async () => {
    createConsultationNoteMocked.mockResolvedValue(null)
    const response = createResponse()
    await createConsultationNoteController(createRequest({ body: value }), response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Appointment not found' })
    expect(response.send).not.toHaveBeenCalled()
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    createConsultationNoteMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(createConsultationNoteController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })
})
