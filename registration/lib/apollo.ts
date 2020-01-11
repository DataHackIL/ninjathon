import fetch from 'node-fetch'
import { ApolloClient } from 'apollo-boost'

export const apolloClient = new ApolloClient({
    fetch
} as any)