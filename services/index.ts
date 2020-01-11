import * as express from 'express'
import * as bodyParser from 'body-parser'
import { readFileSync } from 'fs'
import { join } from 'path'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'

import logger from './utilities/logger'
import emailResolvers from './handlers/email'
import authenticationResolvers, { userPayloadFromRequest } from './handlers/authentication'

const cookieParser = require('cookie-parser')
const typeDefs = readFileSync(join(__dirname, './schema.graphql')).toString()
const resolvers = merge(
    emailResolvers,
    authenticationResolvers
)
const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

// TODO: should be replaced by https://github.com/hasura/graphql-engine/issues/2461
const validateRequest = (req, res, next) => {
    const isInvalidated = !req.headers['x-hasura-role'] || req.headers['x-hasura-role'] === 'anonymous'
    const isIntrospection = req.body['operationName'] === 'IntrospectionQuery'
    const isInternal = ['sendMail'].some(service => req.body['query'].includes(service))

    if (isInvalidated && isInternal && !isIntrospection) {
        res.status(403).json({
            errors: ['Unauthorized access']
        })
    }
    next()
}

app.use(
    '/graphql',
    cookieParser(),
    bodyParser.json(),
    validateRequest,
    graphqlExpress((req, res) => ({
        schema,
        context: ({ req, res }) => ({
            req,
            res,
            userPayload: userPayloadFromRequest({ req, res }),
        }),
    }))
)

// https://www.apollographql.com/docs/apollo-server/api/apollo-server/
// we also use (bodyParser) and cookieParser, so we add those
export interface ApolloServerExpressIntegrationContext {
    req: Express.Request & { cookies: { [key: string]: string } }
    res: Express.Response & {
        cookie<DictKey extends string>(key: DictKey, value: string, opts: any): any
    }
}

export type ResolverContext = ApolloServerExpressIntegrationContext & {
    userPayload: ReturnType<typeof userPayloadFromRequest>
}

// TODO right now, graphiql can't be used to access routes protected with resolverwithauth
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.listen(3000, () => logger.info('Server running, try going to /graphiql', { port: 3000 }))