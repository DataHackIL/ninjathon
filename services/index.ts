import * as express from 'express'
import * as bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'
import logger from './utilities/logger'

const typeDefs = importSchema('schema.graphql')

import emailResolvers from './handlers/email'
import authenticationResolvers from './handlers/authentication'
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

app.use('/graphql', bodyParser.json(), validateRequest, graphqlExpress({ schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.listen(3000, () => logger.info('Server running, try going to /graphiql', { port: 3000 }))