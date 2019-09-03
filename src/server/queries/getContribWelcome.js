const gql = require('graphql-tag').default;
const { CONTRIB_REPOS } = require('./utils');

const contribWelcome = gql`
  {
    contrib_welcome: search(
      type: ISSUE
      query: """
      ${CONTRIB_REPOS.map((n) => `repo:${n}`).join('\n')}
      label:"contrib: welcome"
      is:open
      sort:updated-desc
      type:issues
      """
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
            labels(first: 100) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

module.exports = {
  contribWelcome,
};
