import express from 'express'

import { loginRoutes } from './routes/login'
import { patientsRoutes } from './routes/patients'
import { appointmentsRoutes } from './routes/appointments'
import { errorHandler } from './middlewares/error-handler'
import { requestLogger } from './middlewares/request-logger'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'

const app = express()

app.use(requestLogger)
app.use(express.json())

app.use('/login', loginRoutes)
app.use('/patients', patientsRoutes)
app.use('/appointments', appointmentsRoutes)

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
)

app.use(errorHandler)

export { app }
