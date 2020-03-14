import React, { ChangeEvent } from 'react'
import dynamic from 'next/dynamic'
import { gql } from 'apollo-boost'
import { useRouter } from 'next/router'
import { apolloClient } from '../lib/apollo'
import cookie from 'js-cookie'
import { decode } from 'jsonwebtoken'
import { Team } from '../lib/common'

/**
 * Note: we're sending the variables to grahpql by the input's name.
 */
export const AddTeamPage = props => {
    const router = useRouter()
    const userId = getUserId()

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formEle = document.forms[0]
        const formData = new FormData(formEle)
        const team: Team = {
            name: formData.get('name').toString(),
            description: formData.get('description').toString(),
        }
        // TODO do we need to check whether he's already on a team, and block if he is?
        const teamId = await gqlInsertTeams(team, userId)

        router.replace(`/team/${teamId}`)
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
}

async function gqlInsertTeams(team: Team, userId: string) {
    // This both creates the team and puts the user into the team_members call.
    const graphqlMutation = await apolloClient.mutate({
        mutation: gql`
            mutation MyMutation($objects: [team_members_insert_input!]!) {
                insert_team_members(objects: $objects) {
                    returning {
                        teamId
                    }
                }
            }
        `,
        variables: { objects: { userId, team: { data: team } } },
    })
    const res = graphqlMutation.data.insert_team_members
    if (res.errors) {
        alert(res.errors[0])
        throw res.errors[0]
    }
    const teamId = res.returning[0].teamId

    return teamId
}

function getUserId() {
    const rawToken = cookie.get('token')
    const { payload: token } = decode(rawToken, { complete: true, json: true })
    const userId = token['https://hasura.io/jwt/claims']['x-hasura-user-id']

    return userId
}

export default dynamic(() => import('./add').then(d => d.AddTeamPage), {
    ssr: false,
})
