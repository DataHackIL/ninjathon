import logger from './utilities/logger'
import {Pool} from 'pg'
import {get, isEmpty} from 'lodash'
import {compare, hash} from 'bcrypt'
import {generateJWT, verifyJWT} from './utilities/jwt'

export interface User {
  id: Number
  email: String
  password: String
  role: String
}

const pool = new Pool({
  host: 'postgres',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
})

const getUser = async (email: String): Promise<User> => {
  return get(
    await pool.query({
      text: 'select * from users as "user" where "user".email = $1',
      values: [email]
    }),
    'rows.0',
    null
  )
}

const insertUser = async (email: String, hashedPassword: String): Promise<User> => {
  return get(
    await pool.query({
      text: 'insert into users (email, password) values ($1, $2) returning id, role, email, password',
      values: [email, hashedPassword]
    }),
    'rows.0',
    null
  )
}

export default {
  Mutation: {
    register: async (parent, {email, password}) => {
      if (!isEmpty(await getUser(email))) {
        return {
          errors: ['Email is already registered']
        }
      } else {
        const hashedPassword = await hash(password, 10)
        const user = await insertUser(email, hashedPassword)
        logger.info('New user created', {email: email})

        return {
          token: generateJWT(user),
          ...user
        }
      }
    },
    login: async (parent, {email, password}) => {
      const user = await getUser(email)

      if (isEmpty(user)) {
        return {
          errors: ['Email is not registered']
        }
      } else if (!(await compare(password, user.password))) {
        return {
          errors: ['Incorrect password or email']
        }
      } else {
        logger.info('User logged in', {email: email})

        return {
          token: generateJWT(user),
          ...user
        }
      }
    },
    verify: async (parent, {token}) => {
      const verifiedToken = verifyJWT(token)
      logger.info("Verified token", {
        token: JSON.stringify(token),
        verifiedToken: JSON.stringify(verifiedToken)
      })

      return {
        verified: !!verifiedToken,
        token: verifiedToken,
      }
    },
  }
}
