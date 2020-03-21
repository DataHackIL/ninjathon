import React, { ChangeEvent, useEffect } from 'react'
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

    useEffect(() => {
        async function redirectIfHasTeam() {
            const teamId = await hasTeam(userId)
            if (teamId) {
                router.replace(`/team/${teamId}`)
            }
        }
        redirectIfHasTeam()
    }, [])

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formElement = document.forms[0]
        const formData = new FormData(formElement)
        const team: Team = {
            name: formData.get('name').toString(),
            description: formData.get('description').toString(),
        }

        const teamId = await insertTeams(team, userId)

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

async function hasTeam(userId: string) {
    const graphqlMutation = await apolloClient.query({
        query: gql`
            query hasTeam($userId: Int!) {
                team_members(where: { userId: { _eq: $userId } }) {
                    teamId
                }
            }
        `,
        variables: { userId },
    })

    if (graphqlMutation.data.team_members?.length) {
        return graphqlMutation.data.team_members[0].teamId
    }

    return null
}

async function insertTeams(team: Team, userId: string) {
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
