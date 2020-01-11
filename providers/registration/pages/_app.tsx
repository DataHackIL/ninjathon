import { ApolloProvider } from '@apollo/react-hooks'
import { apolloClient } from '../lib/apollo'
import App from 'next/app'

// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
    </ApolloProvider>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
}

export default MyApp