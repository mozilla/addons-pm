import gql from 'graphql-tag';
import createClient from 'lib/ghapi';
import { validAMOProjectTeamMembers } from 'lib/const';

// addons-robot is outside the org/teams, so we have to cheat to return the
// list of team members.

const query = gql`
  query getTeam($userSearch: String!) {
    search(query: $userSearch, type: USER, first: 10) {
      edges {
        node {
          ... on User {
            id
            avatarUrl
            login
            name
          }
        }
      }
    }
  }
`;

export default async (req, res) => {
  const client = createClient();
  const team = await client.query({
    query,
    variables: {
      userSearch: validAMOProjectTeamMembers.map((x) => `user:${x}`).join(' '),
    },
  });
  res.json(team);
};
