import 'dotenv/config'

import { app } from './app'
import { connectDatabase } from './config/database'
import { errorDetails, logger } from './config/logger'

const PORT = Number(process.env.PORT)

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      logger.info('server.started', { port: PORT })
    })
  } catch (error) {
    logger.error('server.start_failed', { error: errorDetails(error) })
    process.exit(1)
  }
}

startServer()
