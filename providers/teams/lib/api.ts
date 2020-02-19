import { gql } from 'apollo-boost';
import { apolloClient } from '~/lib/apollo';
import { Team } from './common';
import { getUserId } from '~/lib/auth';

export async function insertTeam(team: Omit<Team, 'id'>) {
    const graphqlMutation = await apolloClient.mutate({
        mutation: gql`
            mutation MyMutation($team: [teams_insert_input!]!) {
                insert_teams(objects: $team) {
                    returning {
                        id
                    }
                }
            }
        `,
        variables: { team },
    })
    const res = graphqlMutation.data.insert_teams
    if (res.errors) {
      alert(res.errors[0])
      throw res.errors[0]
    }

    const id = res.returning[0].id
    return { id }
}

export async function insertTeamMembers(teamId: string) {
    const teamMembers = {
      userId: getUserId(),
      teamId: teamId,
    }
    const graphqlMutation = await apolloClient.mutate({
        mutation: gql`
            mutation MyMutation($teamMembers: [team_members_insert_input!]!) {
                insert_team_members(objects: $teamMembers) {
                    returning {
                        id
                    }
                }
            }
        `,
        variables: { teamMembers },
    })
    const res = graphqlMutation.data.insert_team_members
    if (res.errors) {
      alert(res.errors[0])
      throw res.errors[0]
    }
}