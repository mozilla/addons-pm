const gql = require('graphql-tag').default;

const projects = gql`query getProjects($projectSearch: String!) {
  organization(login: "mozilla") {
    projects(first: 100, search: $projectSearch) {
      nodes {
        name
        bodyHTML
        state
        url
        updatedAt
        columns(first:10) {
          edges {
            node {
              id
              name
              cards(first:100, archivedStates:[NOT_ARCHIVED]) {
               	totalCount
              }
            }
          }
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
}`;

module.exports = {
  projects,
}
