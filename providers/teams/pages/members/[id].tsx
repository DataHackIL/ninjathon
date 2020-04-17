import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { gql } from 'apollo-boost'
import { apolloClient } from '../../lib/apollo'

const getTeamMembers = gql`
    query getTeamMembers($teamId: Int!) {
        team_members(where: { teamId: { _eq: $teamId } }) {
            teamId
            user {
                id
                email
                name
                role
            }
        }
    }
`

const getUserByMail = gql`
    query getUsers($userMail: String!) {
        users(where: { email: { _eq: $userMail } }) {
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
    mutation InsertTeamMembers($objects: [team_members_insert_input!]!) {
        insert_team_members(objects: $objects) {
            affected_rows
        }
    }
`

const deleteTeamMember = gql`
    mutation DeleteTeamMembers($userId: Int!, $teamId: Int!) {
        delete_team_members(where: { _and: { userId: { _eq: $userId }, teamId: { _eq: $teamId } } }) {
            returning {
                user {
                    id
                    email
                }
                teamId
            }
        }
    }
`

async function checkHasTeam(userId: string) {
    const graphqlMutation = await apolloClient.query({
        query: hasTeam,
        variables: { userId },
    })

    if (graphqlMutation.data.team_members && graphqlMutation.data.team_members.length) {
        return graphqlMutation.data.team_members[0].teamId
    }

    return null
}

const addMember = async (teamId: string, userMail: string) => {
    const { loading, data, errors } = await apolloClient.query({
        query: getUserByMail,
        variables: { userMail },
    })
    if (loading) return <div>Loading...</div>
    if (errors || !data) console.error(errors || "Couldn't retrieve data.")

    if (data.users.length > 0) {
        const userId = data.users[0].id

        const hasTeamId = await checkHasTeam(userId)
        if (hasTeamId) {
            console.log(`${userMail} is already in team ${hasTeamId}`)
        } else {
            // add user to team
            const { data, errors } = await apolloClient.mutate({
                mutation: insertTeamMember,
                variables: { objects: { teamId: parseInt(teamId), userId } },
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

const removeMember = async (memberData) => {
    // remove user from team
    const { data, errors } = await apolloClient.mutate({
        mutation: deleteTeamMember,
        variables: { uid: memberData.user.id, tid: memberData.teamId },
    })
    if (errors) {
        alert(errors[0])
        throw errors[0]
    }
    return 'success'
}

export const TeamEditMembersPage = () => {
    const router = useRouter()
    const [teamId, setTeamId] = useState(typeof router.query.id === 'string' ? router.query.id : router.query.id[0])
    const [data, setData] = useState(null)
    const [teamMembers, setTeamMembers] = useState([])

    let error
    useEffect(() => {
        apolloClient
            .query({
                query: getTeamMembers,
                variables: {
                    teamId,
                },
            })
            .then(({ loading, data }) => {
                if (!loading && data && data.team_members) {
                    setData(data)
                }
            })
            .catch((err) => (error = err))
    }, [])

    useEffect(() => {
        if (data) {
            setTeamMembers(data.team_members)
        }
    }, [data])

    if (error || !teamMembers) {
        console.error(error || "Couldn't retrieve data.")
        return <div>Couldn't retrieve data.</div>
    }

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formElement = document.forms[0]
        const formData = new FormData(formElement)

        const userMail = formData.get('email').toString()
        const userId = await addMember(teamId, userMail)
        if (userId) {
            router.replace(`/teams/members/${teamId}`)
        }
    }

    return (
        <div>
            <h1>Edit Members Screen</h1>
            <h3>Team {teamId}</h3>
            {teamMembers.map((member, i) => (
                <Member
                    key={i}
                    member={member}
                    teamMembers={teamMembers}
                    setTeamMembers={setTeamMembers}
                    removeMember={removeMember}
                />
            ))}
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

const Member = ({ member, removeMember, teamMembers, setTeamMembers }) => {
    return (
        <div>
            <p>{member.user.email}</p>
            <button
                onClick={() => {
                    removeMember(member)
                    setTeamMembers(teamMembers.filter((mem) => mem.user.email !== member.user.email))
                }}
            >
                Remove
            </button>
        </div>
    )
}

export default dynamic(() => import(`./[id]`).then((d) => d.TeamEditMembersPage), {
    ssr: false,
})
