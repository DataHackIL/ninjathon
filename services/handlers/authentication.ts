import logger from '../utilities/logger'
import { Pool } from 'pg'
import { get, isEmpty } from 'lodash'
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { ApolloServerExpressIntegrationContext, ResolverContext } from '..'
import { combineResolvers } from 'graphql-resolvers'
import { GraphQLFieldResolver } from 'graphql'

const secret = process.env.JWT_SECRET
const algorithm = 'HS512'

const pool = new Pool({
    host: 'postgres',
    user: 'postgres',
    password: 'changeme',
    port: 5432
})

export interface User {
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

export const generateJWT = (user: User, expiresIn = '7d') =>
    sign(getPayload(user), secret, { algorithm, expiresIn })

function getPayload(user: User) {
    return {
        name: user.email,
        iat: new Date().getTime() / 1000,
        'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': [user.role],
            'x-hasura-default-role': user.role,
            'x-hasura-user-id': user.id.toString(),
        },
    }
}

export type UserPayload = ReturnType<typeof getPayload>

export function resolverWithAuth<A, B>(resolver: GraphQLFieldResolver<A, B>) {
    function isAuthenticated(source, args, context, info) {
        if (!Boolean(context.userPayload)) {
            return new Error('Not authenticated')
        }
    }

    return combineResolvers(isAuthenticated, resolver)
}
function respondWithJWTCookie(user: User, context: ResolverContext) {
    const token = generateJWT(user)

    const expiration = process.env.NODE_ENV === 'development' ? 100 : 604800000

    context.res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,
    })
}

export const userPayloadFromRequest = (
    context: ApolloServerExpressIntegrationContext
): UserPayload | undefined => {
    try {
        const { req, res } = context

        const token = req.cookies.token
        if (!token) return undefined

        return verify(token.split(' ')[1], secret, {
            algorithms: [algorithm],
        }) as UserPayload
    } catch (e) {
        // TODO log unauthenticated access
        return undefined
    }
}

export default {
    Mutation: {
        register: async (parent, { email, password }, context: ResolverContext) => {
            if (!isEmpty(await getUser(email))) {
                return {
                    errors: ['Email is already registered']
                }
            } else {
                const hashedPassword = await hash(password, 10)
                const user = await insertUser(email, hashedPassword)
                logger.info('New user created', { email: email })

                respondWithJWTCookie(user, context)

                return {
                    token: generateJWT(user),
                    ...user
                }
            }
        },
        login: async (parent, { email, password }, context: ResolverContext) => {
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

                respondWithJWTCookie(user, context)

                return {
                    token: generateJWT(user),
                    ...user
                }
            }
        }
    }
}