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
