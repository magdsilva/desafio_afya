import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../repositories/users/get-user-by-email'
import { logger } from '../config/logger'


interface LoginInput {
  email: string
  password: string
}

export const login = async ({
  email,
  password
}: LoginInput) => {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordMatches) {
    throw new Error('Invalid email or password')
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT secret is not configured')
  }

  const token = jwt.sign(
    {},
    secret,
    {
      subject: user.id,
      expiresIn: '1h'
    }
  )

  logger.info({
    event: 'login.authenticated',
    message: 'User authenticated successfully',
    user_id: user.id,
  })

  return {
    token
  }
}
