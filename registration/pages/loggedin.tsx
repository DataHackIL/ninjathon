import React from 'react'
import { withAuthentication } from '../lib/auth'

const LoggedIn = withAuthentication((props) => {
return <div>Logged in: {props.isLoggedIn}.</div>
})

LoggedIn.getInitialProps = async () => {
    return { isLoggedIn: 'true' } // demonstrates usage of getInitialProps with withAuthentication decorator.
}

export default LoggedIn
