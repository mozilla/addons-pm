import { cleanup, render } from '@testing-library/react';
import * as nextRouter from 'next/router';
import fetchMock from 'fetch-mock';
import ghIssueCountsData from 'tests/fixtures/gh-issue-counts';
import DashboardAMO, { getServerSideProps } from 'pages/dashboards/amo';

describe(__filename, () => {
  beforeEach(() => {
    nextRouter.useRouter = jest.fn();
    fetchMock.mock(/\/api\/gh-issue-counts\//, ghIssueCountsData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the AMO dashboard', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/dashboards/amo/',
    }));
    const { props } = await getServerSideProps();
    const { findByRole, findAllByText } = render(<DashboardAMO {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');

    // All the dashgroups.
    const cardGroups = await findAllByText(/.*?/, { selector: '.card-grp' });
    expect(cardGroups).toHaveLength(5);
  });
});
