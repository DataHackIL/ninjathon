import App from 'next/app'
import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { apolloClient } from '../lib/apollo'

function TeamsApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}

TeamsApp.getInitialProps = async appContext => {
    const appProps = await App.getInitialProps(appContext)
    return { ...appProps }
}

export default TeamsApp