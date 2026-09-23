import { getAppointmentsController } from './controller'
import { getAppointments } from '../../../use-cases/appointments/get-appointments'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { userId, appointment } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/appointments/get-appointments')

const getAppointmentsMocked = jest.mocked(getAppointments)

const value = {}

beforeEach(() => {
  jest.resetAllMocks()
  getAppointmentsMocked.mockResolvedValue([appointment])
})

describe('Controller - controller', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: {} })
    const response = createResponse()
    await expect(getAppointmentsController(request, response)).resolves.toBe(response)
    expect(getAppointmentsMocked).toHaveBeenCalledTimes(1)
    expect(getAppointmentsMocked).toHaveBeenCalledWith(userId)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith([appointment])
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    getAppointmentsMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(getAppointmentsController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })

  it('returns 200 for an empty list', async () => {
    getAppointmentsMocked.mockResolvedValue([])
    const response = createResponse()
    await getAppointmentsController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith([])
  })
})
