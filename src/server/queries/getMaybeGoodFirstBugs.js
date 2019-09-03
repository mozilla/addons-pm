const gql = require('graphql-tag').default;
const { CONTRIB_REPOS } = require('./utils');

const maybeGoodFirstBugs = gql`
  {
    maybe_good_first_bugs: search(
      type: ISSUE
      query: """
      ${CONTRIB_REPOS.map((n) => `repo:${n}`).join('\n')}
      label:"contrib: maybe good first bug"
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
  maybeGoodFirstBugs,
};
