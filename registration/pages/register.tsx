import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useRouter } from 'next/router'
import React from 'react'

import { login } from '../lib/auth/auth'
import { nextConnect } from '../lib/decorators'

const RegisterPage = nextConnect({
    withAuth: false,
})(() => {
    const registerQuery = useRegisterQuery()
    const router = useRouter()
    return (
        <form
            onSubmit={async e => {
                e.preventDefault()
                const formData = new FormData((e as any).target)
                try {
                    const token = await registerQuery(formData)
                    login({ token })
                    router.replace('/loggedin')
                } catch (e) {
                    // TODO
                    alert('Error: ' + e)
                }
            }}
        >
            <input type="text" placeholder="email" name="email" />
            <input type="text" placeholder="password" name="password" />
            <input type="submit" value="Submit" />
        </form>
    )
})

const useRegisterQuery = () => {
    const [registerQuery] = useMutation(gql`
    mutation Register($email: String!, $password: String!) {
      register(email: $email, password: $password) {
        token
      }
    }
  `)

    return async (formData: FormData) => {
        const {
            data: {
                register: { token },
            },
        } = await registerQuery({ variables: Object.fromEntries(formData) })

        return token
    }
}

export default RegisterPage
