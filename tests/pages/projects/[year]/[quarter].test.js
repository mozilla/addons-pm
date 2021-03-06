/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';
import * as nextRouter from 'next/router';
import ghProjectsData from 'tests/fixtures/gh-projects';
import ghTeamData from 'tests/fixtures/gh-team';
import { cleanup, render } from '@testing-library/react';
import Projects, { getServerSideProps } from 'pages/projects/[year]/[quarter]';

describe(__filename, () => {
  let fakeProps;

  beforeEach(() => {
    nextRouter.useRouter = jest.fn();
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
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/projects/2021/Q1/',
      query: {
        year: '2021',
        quarter: 'Q1',
      },
    }));
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
