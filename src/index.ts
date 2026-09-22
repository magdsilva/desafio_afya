import 'dotenv/config'

import { app } from './app'
import { connectDatabase } from './config/database'

const PORT = Number(process.env.PORT)

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log('Server running...')
    })
  } catch (error) {
    console.error('Start application is failed:', error)
    process.exit(1)
  }
}

startServer()