import fetchMock from 'fetch-mock';
import * as nextRouter from 'next/router';
import ghMaybeGoodFirstBugsData from 'fixtures/gh-maybe-good-first-bugs';
import { cleanup, render } from '@testing-library/react';
import MaybeGoodFirstBugs, {
  getServerSideProps,
} from 'pages/contrib/maybe-good-first-bugs';

describe(__filename, () => {
  beforeEach(() => {
    nextRouter.useRouter = jest.fn();
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
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/contrib/maybe-good-first-bugs/',
      query: {
        dir: 'asc',
        sort: 'updatedAt',
      },
    }));
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
    ).toBe(1);
  });
});
