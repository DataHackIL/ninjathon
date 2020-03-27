import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useRouter } from 'next/router'
import { decode } from 'jsonwebtoken'

import cookie from 'js-cookie'
import { useQuery } from '@apollo/react-hooks'
import dynamic from 'next/dynamic'
import { Team } from '../lib/common'
// console.log(decode(cookie.get('token'), { complete: true, json: true }))

const QUERY = gql`
    query getIDPageData($teamId: Int!) {
        teams_by_pk(id: $teamId) {
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
                    description
                }
            }
        }
    }
`

export const TeamProfilePage = props => {
    const router = useRouter()
    const teamId = router.query.id
    const { loading, data, error } = useQuery(QUERY, { variables: { teamId } })
    if (loading) return <div>Loading...</div>
    if (error || !data) console.error(error || "Couldn't retrieve data.")
    if (!data.teams_by_pk) return <div>Team not found...</div>
    const { description, id, name, team_members, teams_challenges } = data.teams_by_pk

    return (
        <section>
            <h1>{name}</h1>
            <p>{description}</p>
            <div>
                <h3>Team Members</h3>
                <ul>
                    {team_members.map(tm => (
                        <li>{tm.user.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Challenges the team participates in</h3>
                <ul>
                    {teams_challenges.map(tc => (
                        <li>
                            <b>{tc.challenge.name}</b> - {tc.challenge.description}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default dynamic(() => import('./[id]').then(d => d.TeamProfilePage), {
    ssr: false,
})
