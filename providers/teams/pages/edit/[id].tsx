import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { gql } from 'apollo-boost'
import { apolloClient } from '../../lib/apollo'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { VariablesAreInputTypes } from 'graphql/validation/rules/VariablesAreInputTypes'

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

const getTeamChallenge = gql`
    query getTeamChallenge($teamId: Int!) {
        teams_challenges(where: { teamId: { _eq: $teamId } }) {
            challenge {
                name
                id
                createdByUserId
                description
            }
            teamId
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
            returning {
                teamId
                user {
                    id
                    email
                    name
                    role
                }
            }
        }
    }
`

const insertTeamChallenge = gql`
    mutation InsertTeamChallenge($teamId: Int!, $challengeId: Int!) {
        insert_teams_challenges(objects: { teamId: $teamId, challengeId: $challengeId }) {
            returning {
                challenge {
                    name
                    id
                }
                teamId
            }
        }
    }
`

const updateTeamChallenge = gql`
    mutation updateTeamChallenges($teamId: Int!, $challengeId: Int!) {
        update_teams_challenges(where: { teamId: { _eq: $teamId } }, _set: { challengeId: $challengeId }) {
            returning {
                challengeId
                challenge {
                    name
                }
                teamId
            }
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
            // handle this
        } else {
            // add user to team
            const { data, errors } = await apolloClient.mutate({
                mutation: insertTeamMember,
                variables: { objects: { teamId: parseInt(teamId), userId } },
                refetchQueries: [
                    {
                        query: getTeamMembers,
                        variables: { teamId },
                    },
                    {
                        query: hasTeam,
                        variables: { userId },
                    },
                ],
            })
            if (errors) {
                alert(errors[0])
                throw errors[0]
            }
            return data.insert_team_members.returning[0]
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
        refetchQueries: [
            {
                query: getTeamMembers,
                variables: { teamId: memberData.teamId },
            },
            {
                query: hasTeam,
                variables: { userId: memberData.user.id },
            },
        ],
    })
    if (errors) {
        alert(errors[0])
        throw errors[0]
    }
    return 'success'
}

const updateChallenge = async (challenges, newChallenge, teamId) => {
    // check if team has challenge:
    const { data, errors } = await apolloClient.query({ query: getTeamChallenge, variables: { teamId } })
    if (data) {
        const challengeId = challenges.find((chal) => chal.name === newChallenge).id
        if (data.teams_challenges.length == 1) {
            await apolloClient.mutate({
                mutation: updateTeamChallenge,
                variables: { teamId, challengeId },
                refetchQueries: [
                    {
                        query: getTeamChallenge,
                        variables: { teamId },
                    },
                ],
            })
        } else if (data.teams_challenges.length == 0) {
            await apolloClient.mutate({
                mutation: insertTeamChallenge,
                variables: { teamId, challengeId },
                refetchQueries: [
                    {
                        query: getTeamChallenge,
                        variables: { teamId },
                    },
                ],
            })
        } else {
            console.error('team has multiple challenges')
            // There are multiple challenges for a given team, how to handle?
        }
    }
    if (errors) {
        alert(errors[0])
        throw errors[0]
    }
    return newChallenge
}

export const TeamEditMembersPage = () => {
    const router = useRouter()
    const [teamId, setTeamId] = useState(typeof router.query.id === 'string' ? router.query.id : router.query.id[0])
    // const [data, setData] = useState(null)
    const [teamMembers, setTeamMembers] = useState([])
    const [challenges, setChallenges] = useState([])
    const [currentChallenge, setCurrentChallenge] = useState('')

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
            console.log(getCurrentChallengeData.teams_challenges)
            if (getCurrentChallengeData.teams_challenges && getCurrentChallengeData.teams_challenges.length != 0) {
                setCurrentChallenge(getCurrentChallengeData.teams_challenges[0].challenge.name)
            }
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
        const newTeamMember = await addMember(teamId, userMail)
        if (newTeamMember) {
            setTeamMembers([...teamMembers, newTeamMember])
        }
    }

    async function submitChallenge(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formElement = document.forms[1]
        const formData = new FormData(formElement)
        const newChallenge: string = formData.get('challenge').toString()
        await updateChallenge(challenges, newChallenge, teamId)
        setCurrentChallenge(newChallenge)
    }

    return (
        <div>
            <h1>Team Management Screen</h1>
            <h3>Team ID {teamId}</h3>
            <h3>Team Members</h3>
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

            <h3>Team Challenge: {currentChallenge}</h3>
            <form onSubmit={submitChallenge}>
                <div>
                    <label htmlFor="name">Change challenge </label>
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
