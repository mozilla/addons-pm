import gql from 'graphql-tag';
import createClient from 'lib/ghapi';

const query = gql`
  fragment issueCounts on Repository {
    description
    total_issues: issues(states: OPEN) {
      totalCount
    }
    triaged: issues(
      states: OPEN
      labels: [
        "priority: p1"
        "priority: p2"
        "priority: p3"
        "priority: p4"
        "priority: p5"
      ]
    ) {
      totalCount
    }
    open_p1s: issues(states: OPEN, labels: "priority: p1") {
      totalCount
    }
    open_p2s: issues(states: OPEN, labels: "priority: p2") {
      totalCount
    }
    open_prs: pullRequests(states: OPEN) {
      totalCount
    }
  }

  {
    addons: repository(name: "addons", owner: "mozilla") {
      ...issueCounts
    }
    addons_server: repository(name: "addons-server", owner: "mozilla") {
      ...issueCounts
    }
    addons_frontend: repository(name: "addons-frontend", owner: "mozilla") {
      ...issueCounts
    }
    addons_linter: repository(name: "addons-linter", owner: "mozilla") {
      ...issueCounts
    }
    addons_code_manager: repository(
      name: "addons-code-manager"
      owner: "mozilla"
    ) {
      ...issueCounts
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
