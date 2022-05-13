/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';
import mockRouter from 'next-router-mock';
import { cleanup, render } from '@testing-library/react';
import ghGoodFirstBugsData from 'tests/fixtures/gh-good-first-bugs';
import GoodFirstBugs, {
  getServerSideProps,
} from 'pages/contrib/good-first-bugs';

// eslint-disable-next-line global-require
jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/gh-good-first-bugs\//, ghGoodFirstBugsData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Good First Bugs Page', async () => {
    mockRouter.setCurrentUrl('/contrib/good-first-bugs?dir=asc&sort=updatedAt');
    const { props } = await getServerSideProps();
    const { findByRole } = render(<GoodFirstBugs {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps();
    expect(
      serverProps.goodFirstBugsData.data.good_first_bugs.results.length,
    ).toEqual(3);
  });
});
