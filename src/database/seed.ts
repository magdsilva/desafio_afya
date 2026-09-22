import 'dotenv/config'

import bcrypt from 'bcrypt'

import { database } from '../config/database'

const seed = async (): Promise<void> => {
  const name = process.env.SEED_USER_NAME
  const email = process.env.SEED_USER_EMAIL
  const password = process.env.SEED_USER_PASSWORD

  if (!name || !email || !password) {
    throw new Error('Seed user environment variables are missing')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const result = await database.query(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email
      `,
      [name, email, passwordHash]
    )

    if (result.rowCount === 0) {
      console.log('Seed user already exists')
      return
    }

    console.log('Seed user created successfully')
    console.log(result.rows[0])
  } finally {
    await database.end()
  }
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})