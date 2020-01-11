import React from 'react'
import { withAuthentication } from '../lib/auth'

const DummyRoute = withAuthentication(() => {
    return <div>Logged in.</div>
})

export default DummyRoute
