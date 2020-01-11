import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
import fetch from 'node-fetch'

import { withAuthentication } from './auth/auth'

const client = new ApolloClient({
    fetch: fetch as any,
})

export function nextConnect({ withAuth = true }) {
    return Component => {
        let modifiedComponent = Component

        // connect with apollo provider from the outside
        modifiedComponent = props => (
            <ApolloProvider client={client}>
                <Component {...props} />
            </ApolloProvider>
        )

        // make sure this is last since it uses getInitialProps
        if (withAuth) {
            modifiedComponent = withAuthentication(modifiedComponent)
        }

        return modifiedComponent
    }
}
