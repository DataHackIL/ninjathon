import React from 'react'

import { AuthProps } from '../lib/auth/auth'

function Home(props: AuthProps) {
    return (
        <div>
            <a href="login">Login</a>
            <a href="register">Register</a>
            <p>{props.isAuthenticated ? 'Logged in' : 'not logged in'}</p>
        </div>
    )
}

export default Home