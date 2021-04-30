import gql from 'graphql-tag';
import createClient from 'lib/ghapi';

const query = gql`
  query getAddonsTeam {
    organization(login: "mozilla") {
      team(slug: "addons-core") {
        members(first: 100, membership: ALL) {
          nodes {
            name
            login
            avatarUrl
          }
        }
      }
      outreachy: team(slug: "addons-outreachy") {
        members(first: 100, membership: ALL) {
          nodes {
            name
            login
            avatarUrl
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
  });
  res.json(team);
};
