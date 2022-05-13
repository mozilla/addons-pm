/**
 * @jest-environment jsdom
 */

import { cleanup, render } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import fetchMock from 'fetch-mock';
import ghIssueCountsData from 'tests/fixtures/gh-issue-counts';
import DashboardAMO, { getServerSideProps } from 'pages/dashboards/amo';

// eslint-disable-next-line global-require
jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/gh-issue-counts\//, ghIssueCountsData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the AMO dashboard', async () => {
    mockRouter.setCurrentUrl('/dashboards/amo/');
    const { props } = await getServerSideProps();
    const { findByRole, findAllByText } = render(<DashboardAMO {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');

    // All the dashgroups.
    const cardGroups = await findAllByText(/.*?/, { selector: '.card-grp' });
    expect(cardGroups).toHaveLength(6);
  });
});
