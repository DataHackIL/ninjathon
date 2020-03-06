import {sign, verify} from 'jsonwebtoken'
import {User} from '../resolvers'
import logger from './logger'

export const generateJWT = (user: User) =>
  sign({
      name: user.email,
      iat: new Date().getTime() / 1000,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': [user.role],
        'x-hasura-default-role': user.role,
        'x-hasura-user-id': user.id.toString()
      }
    },
    process.env.JWT_SECRET,
    {algorithm: 'HS512'}
  )

export const verifyJWT = (token: string) => {
  try {
    return verify(token, process.env.JWT_SECRET, {algorithms: ['HS512']})
  } catch (error) {
    logger.error('Failed to verify token', error)
    return null
  }
}
