import App, { AppContext } from 'next/app'
import React from 'react'
import { handleAuth } from '../lib/auth'

function TeamsApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

TeamsApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext)

    await handleAuth(appContext.ctx)

    return { ...appProps }
}

export default TeamsApp
