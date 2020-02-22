import App from 'next/app'
import React from 'react'

function TeamsApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

TeamsApp.getInitialProps = async appContext => {
    const appProps = await App.getInitialProps(appContext)
    return { ...appProps }
}

export default TeamsApp
