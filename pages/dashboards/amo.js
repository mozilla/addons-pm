import React from 'react';
import { Helmet } from 'react-helmet';
import Error from 'next/error';
import { Container } from 'react-bootstrap';
import useSWR from 'swr';
import AMODashCountGroup from 'components/AMODashCountGroup';
import { getApiURL } from 'lib/utils';

function renderCounts(issueCountData) {
  const countGroups = [];
  Object.keys(issueCountData).forEach((repo) => {
    countGroups.push(
      <AMODashCountGroup
        key={repo}
        issueCounts={issueCountData[repo]}
        description={issueCountData[repo].description}
        repo={repo}
      />,
    );
  });
  return countGroups;
}

const githubIssueCountsURL = getApiURL('/api/gh-issue-counts/');

export async function getServerSideProps() {
  const res = await fetch(githubIssueCountsURL);
  const errorCode = res.ok ? false : res.status;
  const amoDashData = await res.json();

  return {
    props: {
      errorCode,
      issueCounts: amoDashData,
    },
  };
}

const DashboardAMO = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

  const { data, error } = useSWR(
    githubIssueCountsURL,
    async () => {
      const result = await fetch(githubIssueCountsURL);
      return result.json();
    },
    { refreshInterval: 30000, initialData: props.issueCounts },
  );

  const isLoading = !error && !data;
  // const isError = error;

  return (
    <div className="dashboard">
      <Helmet>
        <title>AMO Dashboard</title>
        <body className="dash" />
      </Helmet>
      <Container as="main">
        <div className="dash-container">
          {isLoading ? (
            <div className="loading">
              <p>Loading...</p>
            </div>
          ) : (
            renderCounts(data.data)
          )}
        </div>
      </Container>
    </div>
  );
};

export default DashboardAMO;
