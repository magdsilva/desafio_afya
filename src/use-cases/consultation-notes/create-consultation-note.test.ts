import { createConsultationNote } from './create-consultation-note'
import { getAppointmentById } from '../../repositories/appointments/get-appointment-by-id'
import { createConsultationNote as createConsultationNoteRepository } from '../../repositories/consultation-notes/create-consultation-note'
import { id, userId, appointment, note } from '../../__test-support__/fixtures'

jest.mock('../../repositories/appointments/get-appointment-by-id')
jest.mock('../../repositories/consultation-notes/create-consultation-note')

const getAppointmentByIdMocked = jest.mocked(getAppointmentById)
const createConsultationNoteMocked = jest.mocked(createConsultationNoteRepository)

beforeEach(() => {
  jest.resetAllMocks()
  getAppointmentByIdMocked.mockResolvedValue(appointment)
  createConsultationNoteMocked.mockResolvedValue(note)
})

describe('createConsultationNote', () => {
  it('creates a note for an appointment belonging to the user', async () => {
    await expect(createConsultationNote(id, userId, note.description)).resolves.toEqual(note)
    expect(getAppointmentByIdMocked).toHaveBeenCalledWith(id, userId)
    expect(createConsultationNoteMocked).toHaveBeenCalledWith(id, note.description)
  })

  it('does not create a note when the appointment is not found', async () => {
    getAppointmentByIdMocked.mockResolvedValue(null)
    await expect(createConsultationNote(id, userId, note.description)).resolves.toBeNull()
    expect(createConsultationNoteMocked).not.toHaveBeenCalled()
  })

  it.each(['lookup', 'insert'])('propagates a failure in %s', async (step) => {
    const error = new Error('Repository failed')
    if (step === 'lookup') getAppointmentByIdMocked.mockRejectedValue(error)
    else createConsultationNoteMocked.mockRejectedValue(error)
    await expect(createConsultationNote(id, userId, note.description)).rejects.toBe(error)
  })
})
