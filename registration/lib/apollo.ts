import { ApolloClient } from 'apollo-boost';
import fetch from 'node-fetch'

export const apolloClient = new ApolloClient({
    fetch: fetch as any,
})