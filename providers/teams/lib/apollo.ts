import fetch from 'node-fetch'
import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloClientOptions } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import cookie from 'js-cookie'

const cache = new InMemoryCache({
    addTypename: false,
})

const link = createHttpLink({
    uri: 'http://localhost:2015/graphql',
    headers: {
        Authorization: 'Bearer ' + cookie.get('token'),
    },
    fetch: fetch as any,
})

const options = {
    fetch,
    link,
    cache,
    ssrMode: !process.browser,
} as ApolloClientOptions<NormalizedCacheObject>

export const apolloClient = new ApolloClient<NormalizedCacheObject>(options)
