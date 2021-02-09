import fetchMock from 'fetch-mock';
import * as nextRouter from 'next/router';
import ghMilestoneIssuesData from 'fixtures/gh-milestone-issues';
import { cleanup, render } from '@testing-library/react';
import Milestones, { getServerSideProps } from 'pages/milestones/[milestone]';

describe('Milestone Page', () => {
  let fakeProps;

  beforeEach(() => {
    nextRouter.useRouter = jest.fn();
    fetchMock.mock(/\/api\/gh-milestone-issues\//, ghMilestoneIssuesData);
    fakeProps = {
      params: {
        milestone: '2021-01-21',
      },
    };
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Milestone Page', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/milestones/2021-01-21/',
      query: {
        milestone: '2021-01-21',
        dir: 'asc',
        sort: 'assignee',
      },
    }));
    const { props } = await getServerSideProps(fakeProps);
    const { findByRole } = render(<Milestones {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps(fakeProps);
    expect(serverProps.milestoneIssues.length).toBe(13);
  });
});
