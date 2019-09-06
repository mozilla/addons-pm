const gql = require('graphql-tag').default;

const milestoneIssues = gql`
  query getMilestoneIssue($query: String!) {
    milestone_issues: search(type: ISSUE, query: $query, first: 100) {
      issueCount
      results: edges {
        issue: node {
          ... on Issue {
            state
            number
            updatedAt
            title
            url
            repository {
              name
            }
            assignees(first: 10) {
              nodes {
                id
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
            timelineItems(last: 20, itemTypes: CROSS_REFERENCED_EVENT) {
              edges {
                event: node {
                  ... on CrossReferencedEvent {
                    source {
                      ... on PullRequest {
                        reviews(first: 10, states: APPROVED) {
                          totalCount
                          edges {
                            review: node {
                              author {
                                login
                                avatarUrl
                              }
                            }
                          }
                        }
                      }
                    }
                  }
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
