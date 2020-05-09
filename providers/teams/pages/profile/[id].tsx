import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { gql } from 'apollo-boost'
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

export const TeamProfilePage = () => {
    const router = useRouter()
    const [teamId, setTeamId] = useState(typeof router.query.id === 'string' ? router.query.id : router.query.id[0])

    const [teamMembers, setTeamMembers] = useState([])
    const [currentChallenge, setCurrentChallenge] = useState('')

    const {
        loading: getTeamMembersLoading,
        data: getTeamMembersData,
        error: getTeamMembersError,
    } = useQuery(getTeamMembers, { variables: { teamId } })

    const { data: getCurrentChallengeData } = useQuery(getTeamChallenge, {
        variables: { teamId },
    })

    // define hook before checking if loading
    useEffect(() => {
        if (getTeamMembersData && getCurrentChallengeData) {
            setTeamMembers(getTeamMembersData.team_members)
            console.log(getCurrentChallengeData.teams_challenges)
            if (getCurrentChallengeData.teams_challenges && getCurrentChallengeData.teams_challenges.length != 0) {
                setCurrentChallenge(getCurrentChallengeData.teams_challenges[0].challenge.name)
            }
        }
    }, [getTeamMembersData, getCurrentChallengeData])

    if (getTeamMembersLoading) return <div>Loading...</div>
    if (getTeamMembersError || !getTeamMembersData) console.error(getTeamMembersError || "Couldn't retrieve data.")

    if (getTeamMembersError || !teamMembers) {
        console.error(getTeamMembersError || "Couldn't retrieve data.")
        return <div>Couldn't retrieve data.</div>
    }

    return (
        <div>
            <h1>Team Management Screen</h1>
            <h3>Team ID {teamId}</h3>
            <h3>Team Members</h3>
            {teamMembers.map((member, i) => (
                <Member key={i} member={member} />
            ))}

            <h3>Team Challenge: {currentChallenge}</h3>
        </div>
    )
}

const Member = ({ member }) => {
    return (
        <div>
            <p>{member.user.email}</p>
        </div>
    )
}

export default dynamic(() => import(`./[id]`).then((d) => d.TeamProfilePage), {
    ssr: false,
})
