import { ApolloProvider } from '@apollo/react-hooks'
import { apolloClient } from '../lib/apollo'


// documentation for _app is almost non-existent, but i found this 
// https://github.com/zeit/next.js/blob/canary/errors/app-container-deprecated.md
export default ({ Component, pageProps }) => {
    return <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
    </ApolloProvider>
}