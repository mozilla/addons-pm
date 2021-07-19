import gql from 'graphql-tag';
import createClient from 'lib/ghapi';
import { validMilestoneRX } from 'lib/const';
import { oneLine } from 'common-tags';

const query = gql`
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
                        bodyText
                        permalink
                        reviews(last: 10, states: APPROVED) {
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

export default async (req, res) => {
  const client = createClient();

  let { milestone } = req.query;
  // Next.js requires us to use `-` in urls instead of `.` due to
  // https://github.com/vercel/next.js/issues/16617

  if (!validMilestoneRX.test(milestone)) {
    res.status(400).json({ error: 'Incorrect milestone format' });
  } else {
    milestone = milestone.replace(/-/g, '.');
    const variables = {
      query: oneLine`repo:mozilla/addons
      repo:mozilla/addons-server
      repo:mozilla/addons-frontend
      repo:mozilla/addons-blog
      repo:mozilla/addons-linter
      repo:mozilla/addons-code-manager
      milestone:${milestone}
      type:issues`,
    };
    const data = await client.query({
      query,
      variables,
    });
    res.json(data);
  }
};
