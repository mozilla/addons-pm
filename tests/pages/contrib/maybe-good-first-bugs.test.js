/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';
import mockRouter from 'next-router-mock';
import ghMaybeGoodFirstBugsData from 'tests/fixtures/gh-maybe-good-first-bugs';
import { cleanup, render } from '@testing-library/react';
import MaybeGoodFirstBugs, {
  getServerSideProps,
} from 'pages/contrib/maybe-good-first-bugs';

jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(
      /\/api\/gh-maybe-good-first-bugs\//,
      ghMaybeGoodFirstBugsData,
    );
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Maybe Good First Bugs Page', async () => {
    mockRouter.setCurrentUrl(
      '/contrib/maybe-good-first-bugs/?dir=asc&sort=updatedAt',
    );
    const { props } = await getServerSideProps();
    const { findByRole } = render(<MaybeGoodFirstBugs {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps();
    expect(
      serverProps.maybeGoodFirstBugsData.data.maybe_good_first_bugs.results
        .length,
    ).toEqual(1);
  });
});
