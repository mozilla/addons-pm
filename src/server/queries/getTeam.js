const gql = require('graphql-tag').default;

const team = gql`
  query getAddonsTeam {
    organization(login: "mozilla") {
      team(slug: "addons-team") {
        name
        members(first: 100, membership: ALL) {
          nodes {
            name
            login
            avatarUrl
          }
        }
      }
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
`;

module.exports = {
  team,
};
