import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'

import { database } from '../config/database'

const migrationsPath = path.resolve(
  process.cwd(),
  'src',
  'database',
  'migrations',
)

const runMigrations = async (): Promise<void> => {
  const client = await database.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    const files = await fs.readdir(migrationsPath)

    const migrations = files
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const filename of migrations) {
      const migrationAlreadyExecuted = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [filename],
      )

      if (migrationAlreadyExecuted.rowCount) {
        console.log(`Skipping migration: ${filename}`)
        continue
      }

      const filePath = path.join(migrationsPath, filename)
      const sql = await fs.readFile(filePath, 'utf-8')

      console.log(`Running migration: ${filename}`)

      await client.query('BEGIN')

      try {
        await client.query(sql)

        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename],
        )

        await client.query('COMMIT')

        console.log(`Migration completed: ${filename}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }
  } finally {
    client.release()
    await database.end()
  }
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})