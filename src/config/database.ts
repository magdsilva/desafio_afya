import { Pool } from 'pg'
import { errorDetails, logger } from './logger'

export const database = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
})

database.on('error', (error) => {
  logger.error('database.error', { error: errorDetails(error) })
})

const connectDatabase = async (): Promise<void> => {
  const client = await database.connect()

  try {
    await client.query('SELECT 1')
    logger.info('database.connected')
  } finally {
    client.release()
  }
}

export { connectDatabase }
