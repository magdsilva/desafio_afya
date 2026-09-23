import { Pool } from 'pg'

export const database = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
})

database.on('error', (error) => {
  console.error('Unexpected database error:', error)
})

const connectDatabase = async (): Promise<void> => {
  const client = await database.connect()

  try {
    await client.query('SELECT 1')
    console.log('Database connected successfully')
  } finally {
    client.release()
  }
}

export { connectDatabase }