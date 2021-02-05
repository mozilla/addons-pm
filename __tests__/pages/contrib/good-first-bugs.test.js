import React from 'react';
import fetchMock from 'fetch-mock';
import * as nextRouter from 'next/router';
import { cleanup, render } from '@testing-library/react';
import ghGoodFirstBugsData from 'fixtures/gh-good-first-bugs';
import GoodFirstBugs, {
  getServerSideProps,
} from 'pages/contrib/good-first-bugs';

describe('Good First Bugs Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nextRouter.useRouter = jest.fn();
    fetchMock.mock(/\/api\/gh-good-first-bugs\//, ghGoodFirstBugsData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Good First Bugs Page', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/contrib/good-first-bugs/',
      query: {
        dir: 'asc',
        sort: 'updatedAt',
      },
    }));
    const { props } = await getServerSideProps();
    const { findByRole } = render(<GoodFirstBugs {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps();
    expect(
      serverProps.goodFirstBugsData.data.good_first_bugs.results.length,
    ).toBe(3);
  });
});
