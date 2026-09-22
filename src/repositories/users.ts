import { database } from '../config/database'
import { User } from '../interfaces/users'

const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  const result = await database.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0] as User
}

export { getUserByEmail }