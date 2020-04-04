import { useRouter } from "next/router"
import { useQuery } from '@apollo/react-hooks'

import dynamic from "next/dynamic"
import { gql } from "apollo-boost"
import React, { ChangeEvent, useEffect } from 'react'
import { apolloClient } from '../../lib/apollo'


const getTeamMembers = gql`
query getTeamMembers($teamId: Int!) {
    team_members(where: {teamId: {_eq: $teamId}}) {
      teamId
      user {
        email
      }
    }
  }
`

const getUserByMail = gql`
query getUsers($userMail: String!) {
    users(where: {email: {_eq: $userMail }}) {
        id
    }
}
`


const hasTeam = gql`
query hasTeam($userId: Int!) {
    team_members(where: { userId: { _eq: $userId } }) {
        teamId
    }
}
`


const insertTeamMember = gql`
mutation {
    insert_team_members(objects: $objects) {
      affected_rows
    }
  }
`

async function checkHasTeam(userId: string) {
    const graphqlMutation = await apolloClient.query({
        query: hasTeam,
        variables: { userId }
    })

    if (graphqlMutation.data.team_members && graphqlMutation.data.team_members.length) {
        return graphqlMutation.data.team_members[0].teamId
    }

    return null
}


const addMember = async (teamId: string, userMail: string) => {
    const { loading, data, errors } = await apolloClient.query({
        query: getUserByMail,
        variables: { userMail }
    })
    if (loading) return <div>Loading...</div>
    if (errors || !data) console.error(errors || "Couldn't retrieve data.")

    if (data.users.length > 0) {
        const userId = data.users[0].id
        console.log(`userId ${userId}`);
        const hasTeamId = await checkHasTeam(userId)
        if (hasTeamId) {
            console.log(`${userMail} is already in team ${hasTeamId}`);
        } else {
            // add user to team
            const { data, errors } = await apolloClient.mutate({
                mutation: insertTeamMember,
                variables: { objects: {teamId: parseInt(teamId), userId }}
            })
            if (errors) {
                alert(errors[0])
                throw errors[0]
            }
            return 'success'
        }
    } else {
        // user not found
        return null
    }
}

export const TeamEditMembersPage = props => {
    const router = useRouter()
    const teamId: string = (typeof router.query.id === 'string') ? router.query.id : router.query.id[0]
    let { loading, data, error } = useQuery(getTeamMembers, {variables: {teamId}})
    if (loading) return <div>Loading...</div>
    if (error || !data) console.error(error || "Couldn't retrieve data.")
    console.log(data)

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formElement = document.forms[0]
        const formData = new FormData(formElement)

        const userMail: string = formData.get('email').toString()
        const userId = await addMember(teamId, userMail)
        if (userId) {
            router.replace(`/teams/members/${teamId}`)
        }
        



    }

    return (
        <div>
            <h1>Edit Members Screen</h1>
            <h3>Team {teamId}</h3>
            <ul>
                {data.team_members.map((member, i) => <li key={i}>{member.user.email}</li>)}
            </ul>

            <h3>Add Member:</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Email</label>
                    <input type="text" name="email" />
                </div>

                <input type="submit" />
            </form>
        </div>
    )
}

export default dynamic(() => import(`./[id]`).then(d => d.TeamEditMembersPage), {
    ssr: false,
})