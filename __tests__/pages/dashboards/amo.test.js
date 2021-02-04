import React from 'react';
import { render } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import ghIssueCountsData from 'fixtures/gh-issue-counts';
import DashboardAMO from 'pages/dashboards/amo';

const fakeLocation = {
  pathname: '/dashboards/amo/',
};

describe('AMO Dashboard', () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/gh-issue-counts\//, ghIssueCountsData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render the AMO dashboard groups', async () => {
    const { findAllByText } = render(<DashboardAMO location={fakeLocation} />);

    // All the dashgroups.
    const cardGroups = await findAllByText(/.*?/, { selector: '.card-grp' });
    expect(cardGroups).toHaveLength(5);
  });
});
