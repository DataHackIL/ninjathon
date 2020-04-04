import { useRouter } from "next/router"
import { useQuery } from '@apollo/react-hooks'

import dynamic from "next/dynamic"
import { gql } from "apollo-boost"


const QUERY = gql`
    query getIDPageData {
        team_members_by_pk(id: 1) {
            id
            user {
              email
              name
            }
        }
    }
`


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

export const TeamEditMembersPage = props => {
    const router = useRouter()
    const teamId = router.query.id
    const { loading, data, error } = useQuery(QUERY)
    if (loading) return <div>Loading...</div>
    if (error || !data) console.error(error || "Couldn't retrieve data.")
    console.log(data)
    // if (!data.teams_by_pk) return <div>Team not found...</div>

    // async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
    //     event.preventDefault()
    //     const formElement = document.forms[0]
    //     const formData = new FormData(formElement)
    //     const team: Team = {
    //         name: formData.get('name').toString(),
    //         description: formData.get('description').toString(),
    //     }

    //     // const teamId = await insertTeams(team, userId)
    //     // router.replace(`/team/${teamId}`)
    // }

    return (
        <div>
            <h1>Edit Members Screen</h1>
            <h3>Team {teamId}</h3>
            <form >
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
}

export default dynamic(() => import(`./[id]`).then(d => d.TeamEditMembersPage), {
    ssr: false,
})
