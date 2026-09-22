import express, { Request, Response } from 'express'

import { auth } from './middlewares/auth'
import { loginRoutes } from './routes/login'
import { patientsRoutes } from './routes/patients'
import { appointmentsRoutes } from './routes/appointments'

const app = express()

app.use(express.json())

app.get('/health', (_request: Request, response: Response) => {
  return response.status(200).json({
    status: 'App is running'
  })
})

app.use('/login', loginRoutes)

app.use('/patients', patientsRoutes)
app.use('/appointments', appointmentsRoutes)

app.get('/protected', auth, (request: Request, response: Response) => {
  return response.status(200).json({
    message: 'Authenticated',
    userId: request.userId
  })
})

export { app }