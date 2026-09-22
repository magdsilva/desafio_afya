import express, { Request, Response } from 'express'

import { auth } from './middlewares/auth'
import { loginRoutes } from './routes/login'

const app = express()

app.use(express.json())

app.get('/health', (_request: Request, response: Response) => {
  return response.status(200).json({
    status: 'App is running'
  })
})

app.use('/login', loginRoutes)

app.get('/protected', auth, (request: Request, response: Response) => {
  return response.status(200).json({
    message: 'Authenticated',
    userId: request.userId
  })
})

export { app }