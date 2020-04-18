import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { gql } from 'apollo-boost'
import { apolloClient } from '../../lib/apollo'
import { useQuery } from '@apollo/react-hooks'

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

const getCurrentChallenge = gql`
    query getCurrentChallenge($teamId: Int!) {
        teams_challenges(where: { teamId: { _eq: $teamId } }) {
            challenge {
                name
                id
                createdByUserId
                description
            }
        }
    }
`

const getChallenges = gql`
    query getChallenges {
        challenges {
            id
            name
            description
            createdByUserId
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
        variables: { userId: memberData.user.id, teamId: memberData.teamId },
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
    // const [data, setData] = useState(null)
    const [teamMembers, setTeamMembers] = useState([])
    const [challenges, setChallenges] = useState([])
    const [currentChallenge, setCurrentChallenge] = useState("")

    const {
        loading: getTeamMembersLoading,
        data: getTeamMembersData,
        error: getTeamMembersError,
    } = useQuery(getTeamMembers, { variables: { teamId } })
    const { loading: getChallengesLoading, data: getChallengesData, error: getChallengesError } = useQuery(
        getChallenges
    )

    const {
        loading: getCurrentChallengeLoading,
        data: getCurrentChallengeData,
        error: getCurrentChallengeError,
    } = useQuery(getCurrentChallenge, { variables: { teamId } })

    // define hook before checking if loading
    useEffect(() => {
        if (getTeamMembersData && getChallengesData && getCurrentChallengeData) {
            setTeamMembers(getTeamMembersData.team_members)
            setChallenges(getChallengesData.challenges)
            setCurrentChallenge(getCurrentChallengeData.teams_challenges[0].challenge.name)
            console.log(getTeamMembersData)
            console.log(getTeamMembersData)
            console.log(getCurrentChallengeData)
        }
    }, [getTeamMembersData, getChallengesData, getCurrentChallengeData])

    if (getTeamMembersLoading || getChallengesLoading) return <div>Loading...</div>
    if (getTeamMembersError || !getTeamMembersData) console.error(getTeamMembersError || "Couldn't retrieve data.")
    if (getChallengesError || !getChallengesData) console.error(getChallengesError || "Couldn't retrieve data.")

    if (getTeamMembersError || !teamMembers) {
        console.error(getTeamMembersError || "Couldn't retrieve data.")
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

    async function submitChallenge(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formElement = document.forms[1]
        const formData = new FormData(formElement)
        console.log(formData.get('challenge'))
        // change team challenge
    }

    return (
        <div>
            <h1>Team Management Screen</h1>
            <h3>Team {teamId}</h3>
            <h3>Members</h3>
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

            <h3>Challenge: {currentChallenge}</h3>
            <form onSubmit={submitChallenge}>
                <div>
                    <label htmlFor="name">Choose </label>
                    <select id="challenge" name="challenge">
                        {challenges.map((comp, i) => (
                            <Challenge key={i} challenge={comp} />
                        ))}
                    </select>
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

const Challenge = ({ challenge }) => {
    return <option value={challenge.name}>{challenge.name}</option>
}

export default dynamic(() => import(`./[id]`).then((d) => d.TeamEditMembersPage), {
    ssr: false,
})
