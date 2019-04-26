const gql = require('graphql-tag').default;

const team = gql`
  query getAddonsTeam {
    organization(login: "mozilla") {
      team(slug: "addons-service-developers") {
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

module.exports = {
  team,
};
