import React, { FC } from 'react'
import dynamic from "next/dynamic"
import { apolloClient } from '../../lib/apollo';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Team } from '../../lib/common';

const limit = 10
const getOffset = (page: number) => limit * (page - 1)

export const SearchPage = (props) => {
    const { data, error, loading} = useQuery<{ teams: Team[]}>(gql`
        query get_teams($limit: Int, $offset: Int) {
            teams(limit: $limit, offset: $offset) {
                description
                id
                name
            }
            teams_aggregate {
                aggregate {
                count
                }
            }
        }
    `, { variables: { limit, offset: getOffset(1) }})

    if(loading) return <>Loading...</>
    if(error) {
        // console.log(error)
        return <div>GraphQL error</div>
    }
    console.log(data)
    return (
        <div>
            <ul>
                {
                    data.teams.map(t => 
                        <li>
                            <h1>{t.name}</h1>
                            <p>
                                {t.description}
                                {t.pointOfContactUserId}
                            </p>
                        </li>
                        )
                }
            </ul>

        </div>
    )
}

export default dynamic(() => import("./search").then(d => d.SearchPage), { ssr: false })
