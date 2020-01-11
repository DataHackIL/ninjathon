import React from 'react'
import { withAuthentication } from '../lib/auth'

const LoggedIn = withAuthentication(() => {
    return <div>Logged in.</div>
})

export default LoggedIn
