const gql = require('graphql-tag').default;

const milestoneIssues = gql`
  query getMilestoneIssue($query: String!) {
    milestone_issues: search(
      type: ISSUE
      query: $query
      first: 100
    ) {
      issueCount
      results: edges {
        issue: node {
          ... on Issue {
            state,
            number
            updatedAt
            title
            url
            repository {
              name
            }
            assignees(first: 10) {
              nodes {
                name
                login
                avatarUrl
              }
            }
            labels(first: 100) {
              nodes {
                name
              }
            }
            projectCards(first: 100) {
              nodes {
                project {
                  name
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

module.exports = {
  milestoneIssues,
};
