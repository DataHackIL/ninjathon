import * as express from 'express'
import * as bodyParser from 'body-parser'
import { readFileSync } from 'fs'
import { join } from 'path'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'

import logger from './utilities/logger'
import resolvers from './resolvers'

const typeDefs = readFileSync(join(__dirname, './schema.graphql')).toString()
const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

// TODO: should be replaced by https://github.com/hasura/graphql-engine/issues/2461
const validateRequest = (req, res, next) => {
    const isInvalidated: boolean = !req.headers['x-hasura-role'] || req.headers['x-hasura-role'] === 'anonymous'
    const isIntrospection: boolean = req.body['operationName'] === 'IntrospectionQuery'

    if (isInvalidated && !isIntrospection) {
        res.status(403).json({
            errors: ['Unauthorized access']
        })
    }
    next()
}

app.use('/graphql', bodyParser.json(), validateRequest, graphqlExpress({ schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.listen(3000, () => logger.info('Server running, try going to /graphiql', { port: 3000 }))