import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Router from 'next/router'
import { gql } from 'apollo-boost'
import { apolloClient } from './apollo'
import { decode } from 'jsonwebtoken'

export const login = async ({ email, password }, expires = 1) => {
    const graphqlMutation = await apolloClient.mutate({
        mutation: gql`
            mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token
                }
            }
        `,
        variables: { email, password }
    })
    debugger
    if (graphqlMutation.errors.length) {
        throw graphqlMutation.errors[0]
    }

    const { token } = graphqlMutation.data
    cookie.set('token', token, { expires })
}

export const withAuthentication = WrappedComponent => {
    const Wrapper = props => <WrappedComponent {...props} />

    Wrapper.getInitialProps = async ctx => {
        const { token } = nextCookie(ctx)

        const isServer = Boolean(ctx.req)
        if (isServer && !token) {
            ctx.res.writeHead(302, { Location: '/login' })
        } else {
            const expiredToken = token && 
                decode(token, {complete: true,json:true}).iat < new Date
            if(expiredToken) console.log('Token expired!')
            if (!token || expiredToken) {
                Router.push('/login')
            }
        }

        const wrappedComponentInitialProps = WrappedComponent.getInitialProps
            ? await WrappedComponent.getInitialProps(ctx)
            : {}

        return {
            ...wrappedComponentInitialProps,
            isAuthenticated: Boolean(token)
        }
    }

    return Wrapper
}

export type AuthProps = {
    isAuthenticated: boolean
}
