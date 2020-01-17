import { ApolloProvider } from '@apollo/react-hooks'
import { apolloClient } from '../lib/apollo'
import App from 'next/app'


// documentation for _app is almost non-existent, but i found this 
// https://github.com/zeit/next.js/blob/canary/errors/app-container-deprecated.md
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
    </ApolloProvider>
  }
}

export default MyApp