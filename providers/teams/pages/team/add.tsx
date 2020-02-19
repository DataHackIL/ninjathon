import React, { ChangeEvent } from 'react'
import dynamic from 'next/dynamic'
import { apolloClient } from '~/lib/apollo'
import { getUrl } from '~/lib/urls'
import { gql } from 'apollo-boost'
import { useRouter } from 'next/router'
import { withAuthentication } from '~/lib/auth'
import { insertTeam, insertTeamMembers } from '~/lib/api'
import { Team } from '~/lib/common'

/**
 * Note: we're sending the variables to grahpql by the input's name.
 */
export const AddTeamPage = withAuthentication(props => {
    const router = useRouter()

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(document.forms[0])
        const teamData = {
            name: formData.get('name').toString(),
            description: formData.get('description').toString(),
        }
        const { id: teamId } = await insertTeam(teamData)
        await insertTeamMembers(teamId)

        // router.replace(getUrl.profile(teamId))
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
})

export default dynamic(() => import('./add').then(d => d.AddTeamPage), {
    ssr: false,
})
