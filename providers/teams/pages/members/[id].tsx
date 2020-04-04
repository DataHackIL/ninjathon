import { useRouter } from "next/router"
import { useQuery } from '@apollo/react-hooks'

import dynamic from "next/dynamic"
import { gql } from "apollo-boost"
import React, { ChangeEvent, useEffect } from 'react'
import { apolloClient } from '../../lib/apollo'


const getTeamMembers = gql`
query {
    team_members(where: {teamId: {_eq: 1}}) {
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


async function checkHasTeam(userId: string) {
    const graphqlMutation = await apolloClient.query({
        query: hasTeam,
        variables: { userId }
    },
    )

    if (graphqlMutation.data.team_members && graphqlMutation.data.team_members.length) {
        return graphqlMutation.data.team_members[0].teamId
    }

    return null
}

const addMember = async (userMail: string) => {
    const { loading, data, errors } = await apolloClient.query({
        query: getUserByMail,
        variables: { userMail }
    })
    if (loading) return <div>Loading...</div>
    if (errors || !data) console.error(errors || "Couldn't retrieve data.")

    if (data.users.length > 0) {
        console.log(`userId ${data.users[0].id}`);
        const hasTeamId = await checkHasTeam(data.users[0].id)
        if (hasTeam) {
            console.log(`${userMail} is already in team ${hasTeamId}`);
        } else {
            // add user to team
        }
    } else {
        // user not found
    }
}


export const TeamEditMembersPage = props => {
    const router = useRouter()
    const teamId = router.query.id
    let { loading, data, error } = useQuery(getTeamMembers)
    if (loading) return <div>Loading...</div>
    if (error || !data) console.error(error || "Couldn't retrieve data.")
    console.log(data)

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formElement = document.forms[0]
        const formData = new FormData(formElement)
        
        const userMail: string = formData.get('email').toString()
        await addMember(userMail)
        
        // router.replace(`/team/${teamId}`)


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