import { useRouter } from 'next/router'
import React from 'react'

import { login } from '../lib/auth'

const LoginRoute = () => {
    const router = useRouter()

    return (
        <form
            onSubmit={async e => {
                e.preventDefault()
                const formData = new FormData((e as any).target)
                const { email, password } = Object.fromEntries(formData)
                await login({ email, password })
                router.push('/loggedin')
            }}
        >
            <input type="text" placeholder="email" name="email" />
            <input type="text" placeholder="password" name="password" />
            <input type="submit" value="Submit" />
        </form>
    )
}

export default LoginRoute
