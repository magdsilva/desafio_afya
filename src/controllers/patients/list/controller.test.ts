import { getPatientsController } from './controller'
import { getPatients } from '../../../use-cases/patients/get-patients'
import { createRequest, createResponse } from '../../../__test-support__/http'
import { patient } from '../../../__test-support__/fixtures'

jest.mock('../../../use-cases/patients/get-patients')

const getPatientsMocked = jest.mocked(getPatients)

const value = {}

beforeEach(() => {
  jest.resetAllMocks()
  getPatientsMocked.mockResolvedValue([patient])
})

describe('Controller - controller', () => {
  it('returns 200 and passes the expected input to the use case', async () => {
    const request = createRequest({ body: {} })
    const response = createResponse()
    await expect(getPatientsController(request, response)).resolves.toBe(response)
    expect(getPatientsMocked).toHaveBeenCalledTimes(1)
    expect(getPatientsMocked).toHaveBeenCalledWith()
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith([patient])
  })

  it('propagates unexpected failures to the async handler', async () => {
    const error = new Error('Use case failed')
    getPatientsMocked.mockRejectedValue(error)
    const response = createResponse()
    await expect(getPatientsController(createRequest({ body: value }), response)).rejects.toBe(error)
    expect(response.status).not.toHaveBeenCalled()
  })

  it('returns 200 for an empty list', async () => {
    getPatientsMocked.mockResolvedValue([])
    const response = createResponse()
    await getPatientsController(createRequest(), response)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith([])
  })
})
