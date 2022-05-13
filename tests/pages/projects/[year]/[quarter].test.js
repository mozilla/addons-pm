/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';
import mockRouter from 'next-router-mock';
import ghProjectsData from 'tests/fixtures/gh-projects';
import ghTeamData from 'tests/fixtures/gh-team';
import { cleanup, render } from '@testing-library/react';
import Projects, { getServerSideProps } from 'pages/projects/[year]/[quarter]';

jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  let fakeProps;

  beforeEach(() => {
    fetchMock.mock(/\/api\/gh-projects\//, ghProjectsData);
    fetchMock.mock(/\/api\/gh-team\//, ghTeamData);
    fakeProps = {
      params: {
        year: '2021',
        quarter: 'Q1',
      },
    };
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Projects Page', async () => {
    mockRouter.setCurrentUrl('/projects/2021/Q1/?year=2021&quarter=Q1');
    const { props } = await getServerSideProps(fakeProps);
    const { findByRole } = render(<Projects {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps(fakeProps);
    expect(
      serverProps.projects.data.organization.projects.nodes.length,
    ).toEqual(4);
  });
});
