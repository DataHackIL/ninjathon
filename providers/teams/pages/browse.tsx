import React, { ChangeEvent, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const getTeams = gql`
    query MyQuery {
        teams {
            description
            id
            name
            team_members {
                user {
                    name
                }
            }
            teams_challenges {
                challenge {
                    name
                }
            }
        }
    }
`

export const BrowseTeams = (props) => {
    const router = useRouter()

    // TODO: Add team Filter by name
    const [teams, setTeams] = useState([])
    const { loading, data, error } = useQuery(getTeams)

    useEffect(() => {
        if (data) {
            setTeams(data.teams)
        }
    }, [data])

    console.log(data)

    if (loading) return <div>Loading...</div>
    console.log(data.teams[0].teams_challenges[0].challenge.name)

    return (
        <div>
            <h1>Teams</h1>
            <div>
                {data.teams.map((team, i) => (
                    <Team key={i} team={team} />
                ))}
            </div>
        </div>
    )
}

const Team = ({ team }) => {
    if (team.teams_challenges.length == 0) {
        team.teams_challenges.push({ challenge: { name: 'not specified' } })
    }

    return (
        <div>
            <h2>{team.name}</h2>
            <p><b>Description:</b> {team.description}</p>
            <p><b>Challenge:</b> {team.teams_challenges[0].challenge.name}</p>
            <p><b>Members:</b></p>
            <div>
                {team.team_members.map((member, i) => (
                    <Member key={i} member={member} />
                ))}
            </div>
        </div>
    )
}

const Member = ({ member }) => {
    return (
        <span>
            <span>{member.user.name}</span>
        </span>
    )
}

export default dynamic(() => import('./browse').then((d) => d.BrowseTeams), {
    ssr: false,
})
