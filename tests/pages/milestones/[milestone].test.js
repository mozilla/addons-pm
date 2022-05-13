/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';
import mockRouter from 'next-router-mock';
import ghMilestoneIssuesData from 'tests/fixtures/gh-milestone-issues';
import { cleanup, render } from '@testing-library/react';
import Milestones, { getServerSideProps } from 'pages/milestones/[milestone]';

jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  let fakeProps;

  beforeEach(() => {
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
    mockRouter.setCurrentUrl(
      '/milestones/2021-01-21/?milestone=2021-01-21&dir=asc&sort=assignee',
    );
    const { props } = await getServerSideProps(fakeProps);
    const { findByRole } = render(<Milestones {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps(fakeProps);
    expect(serverProps.milestoneIssues.length).toEqual(13);
  });
});
