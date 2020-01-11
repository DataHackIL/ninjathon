import fetch from 'node-fetch'
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = createHttpLink({
  uri: 'http://localhost:2015/graphql',
  fetch: fetch as any,
})

export const apolloClient = new ApolloClient<NormalizedCacheObject>({
    fetch,
    link,
    cache
} as any)