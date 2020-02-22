import React from 'react'
import { withAuthentication } from '../lib/auth'

const LoggedIn = props => {
    return (
        <div>
            {props.message}: {props.isAuthenticated ? 'true' : 'false'}.
        </div>
    )
}

LoggedIn.getInitialProps = async ctx => {
    return { message: 'Logged in' } // demonstrates usage of getInitialProps with withAuthentication decorator.
}

// note we wrap the component right before export, as to not override withAuhentication with our getInitialProps!
export default withAuthentication(LoggedIn)
