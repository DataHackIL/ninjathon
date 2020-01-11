import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Router from 'next/router'

/**
 * Puts the JWT token in the cookie, set expiry to one day.
 */
export const login = ({ token }, expires = 1) => {
    cookie.set('token', token, { expires })
}

export const logout = () => {
    cookie.remove('token')
    Router.push('/')
}

export const withAuthentication = WrappedComponent => {
    const Wrapper = props => <WrappedComponent {...props} />

    Wrapper.getInitialProps = async ctx => {
        const { token } = nextCookie(ctx)

        const isServer = Boolean(ctx.req)
        if (isServer && !token) {
            ctx.res.writeHead(302, { Location: '/login' })
        } else if (!token) {
            Router.push('/login')
        }

        return {
            isAuthenticated: Boolean(token),
        }
    }

    return Wrapper
}

export type AuthProps = {
    isAuthenticated: boolean
}
