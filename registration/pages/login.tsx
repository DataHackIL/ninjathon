import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useRouter } from 'next/router'
import React from 'react'

import { login } from '../lib/auth/auth'
import { nextConnect } from '../lib/decorators'

const LoginRoute = nextConnect({ withAuth: false })(() => {
    const loginQuery = useLoginQuery()
    const router = useRouter()

    return (
        <form
            onSubmit={async e => {
                e.preventDefault()
                const formData = new FormData((e as any).target)
                await loginQuery(formData)
                router.replace('/loggedin')
            }}
        >
            <input type="text" placeholder="email" name="email" />
            <input type="text" placeholder="password" name="password" />
            <input type="submit" value="Submit" />
        </form>
    )
})

const useLoginQuery = () => {
    const [loginQuery] = useMutation(gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `)

    return async (formData: FormData) => {
        const {
            data: {
                login: { token },
            },
        } = await loginQuery({ variables: Object.fromEntries(formData) })

        login({ token })
    }
}

export default LoginRoute
