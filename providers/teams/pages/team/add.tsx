import React, { ChangeEvent } from 'react'
import dynamic from 'next/dynamic'
import { apolloClient } from '~/lib/apollo'
import { getUrl } from '~/lib/urls'
import { gql } from 'apollo-boost'
import { useRouter } from 'next/router'
import { withAuthentication } from '~/lib/auth'

/**
 * Note: we're sending the variables to grahpql by the input's name.
 */
export const AddTeamPage = withAuthentication(props => {
    const router = useRouter()

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(document.forms[0])
        const team = {}
        for (const [key, value] of formData.entries() as any) { // TS is wrong about types here
            team[key] = value
        }
        const graphqlMutation = await apolloClient.mutate({
            mutation: gql`
                mutation MyMutation($team: [teams_insert_input!]!) {
                    insert_teams(objects: $team) {
                        returning {
                            id
                        }
                    }
                }
            `,
            variables: { team },
        })
        const res = graphqlMutation.data.insert_teams
        if (res.errors) {
            alert(res.errors[0])
            throw res.errors[0]
        }
        const id = res.returning[0].id
        router.replace(getUrl.profile(id))
    }

    return (
        <div>
            <h1>Add Team Screen</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Team Name</label>
                    <input type="text" name="name" />
                </div>
                <div>
                    <label htmlFor="name">Description</label>
                    <input type="text" name="description" />
                </div>

                <input type="submit" />
            </form>
        </div>
    )
})

export default dynamic(() => import('./add').then(d => d.AddTeamPage), {
    ssr: false,
})
