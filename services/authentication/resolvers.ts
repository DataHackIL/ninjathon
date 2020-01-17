import logger from './utilities/logger'
import { Pool } from 'pg'
import { get, isEmpty } from 'lodash'
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'

export const jwtAlgorithm = 'HS512'

const pool = new Pool({
    host: 'postgres',
    user: 'postgres',
    password: 'changeme',
    port: 5432
})

interface User {
    id: Number
    email: String
    password: String
    role: String
}

const getUser = async (email: String): Promise<User> => {
    return get(await pool.query({
        text: 'select * from users as "user" where "user".email = $1',
        values: [email]
    }), 'rows.0', null)
}

const insertUser = async (email: String, hashedPassword: String): Promise<User> => {
    return get(await pool.query({
        text: 'insert into users (email, password) values ($1, $2) returning id, role, email, password',
        values: [email, hashedPassword]
    }), 'rows.0', null)
}

export const generateJWT = (user: User) => sign({
    name: user.email,
    iat: new Date().getTime() / 1000,
    'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': [user.role],
        'x-hasura-default-role': user.role,
        'x-hasura-user-id': user.id.toString(),
    },
}, process.env.JWT_SECRET, { algorithm: jwtAlgorithm })

export const getToken = (token: string) => {
    try {
        return verify(token.split(' ')[1], process.env.JWT_SECRET, {
            algorithms: [jwtAlgorithm],
        })
    } catch (e) {
        // TODO log unauthenticated access
        return undefined
    }
}

export default {
    Mutation: {
        register: async (parent, { email, password }) => {
            if (!isEmpty(await getUser(email))) {
                return {
                    errors: ['Email is already registered']
                }
            } else {
                const hashedPassword = await hash(password, 10)
                const user = await insertUser(email, hashedPassword)
                logger.info('New user created', { email: email })

                return {
                    token: generateJWT(user),
                    ...user
                }
            }
        },
        login: async (parent, { email, password }) => {
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
                logger.info('User logged in', { email: email })

                return {
                    token: generateJWT(user),
                    ...user
                }
            }
        }
    }
}