import express from 'express'

import { loginRoutes } from './routes/login'
import { patientsRoutes } from './routes/patients'
import { appointmentsRoutes } from './routes/appointments'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.use(express.json())

app.use('/login', loginRoutes)
app.use('/patients', patientsRoutes)
app.use('/appointments', appointmentsRoutes)

app.use(errorHandler)

export { app }