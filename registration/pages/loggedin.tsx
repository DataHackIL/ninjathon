import React from 'react'

import { nextConnect } from '../lib/decorators'

const DummyRoute = nextConnect({})(() => {
    return <div>Logged in.</div>
})

export default DummyRoute
