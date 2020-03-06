import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Router from 'next/router'
import { gql } from 'apollo-boost'
import { apolloClient } from './apollo'
import { decode } from 'jsonwebtoken'
import { AppContext } from 'next/app'
import { NextPageContext } from 'next'

export const withAuthentication = WrappedComponent => {
    const Wrapper = props => <WrappedComponent {...props} />
    console.log('1')
    Wrapper.getInitialProps = async ctx => {
        const { token } = nextCookie(ctx)
        await handleAuth(ctx)

        const wrappedComponentInitialProps = WrappedComponent.getInitialProps
            ? await WrappedComponent.getInitialProps(ctx)
            : {}

        console.log('6')
        return {
            ...wrappedComponentInitialProps,
            isAuthenticated: Boolean(token),
        }
    }

    return Wrapper
}

export function handleAuth(ctx: NextPageContext) {
    const { token } = nextCookie(ctx)
    console.log('2', token)

    const isServer = typeof window === 'undefined'
    if (isServer && !token) {
        console.log('3')
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.flushHeaders()
        ctx.res.finished = true
        ctx.res.end('hee')
        console.log(Object.keys(ctx.res))
        return
    } else {
        console.log('4')
        const expiredToken = token && decode(token, { complete: true, json: true }).iat < new Date()
        if (expiredToken) console.log('Token expired!')
        if (!token || expiredToken) {
            console.log('5')
            Router.push('/login')
        }
    }
}
