import gql from 'graphql-tag';
import createClient from 'lib/ghapi';
import { validYearRX, validQuarterRX } from 'lib/const';

const query = gql`
  query getProjects($projectSearch: String!) {
    organization(login: "mozilla") {
      projects(first: 100, search: $projectSearch) {
        nodes {
          name
          bodyHTML
          state
          url
          updatedAt
          columns(first: 10) {
            edges {
              node {
                id
                name
                cards(first: 100, archivedStates: [NOT_ARCHIVED]) {
                  totalCount
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
  const { year, quarter } = req.query;

  if (!validYearRX.test(year)) {
    res.status(400).json({ error: 'Incorrect year format' });
  } else if (!validQuarterRX.test(quarter)) {
    res.status(400).json({ error: 'Incorrect quarter format' });
  } else {
    const projects = await client.query({
      query,
      variables: {
        projectSearch: `Add-ons ${quarter} ${year}`,
      },
    });
    res.json(projects);
  }
};
