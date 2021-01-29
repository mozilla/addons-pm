import gql from 'graphql-tag';
import createClient from 'lib/ghapi';
import { contribRepos } from 'lib/const';

const query = gql`{
    good_first_bugs: search(
      type: ISSUE
      query: """
      ${contribRepos.map((n) => `repo:${n}`).join('\n')}
      label:"contrib: good first bug"
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

export default async (req, res) => {
  const client = createClient();
  const data = await client.query({
    query,
  });
  res.json(data);
};
