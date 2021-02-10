import fetchMock from 'fetch-mock';
import * as nextRouter from 'next/router';
import ghContribWelcomeData from 'tests/fixtures/gh-contrib-welcome';
import { cleanup, render } from '@testing-library/react';
import ContribWelcome, {
  getServerSideProps,
} from 'pages/contrib/contrib-welcome';

describe(__filename, () => {
  beforeEach(() => {
    nextRouter.useRouter = jest.fn();
    fetchMock.mock(/\/api\/gh-contrib-welcome\//, ghContribWelcomeData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Contrib Welcome Page', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/contrib/contrib-welcome/',
      query: {
        dir: 'asc',
        sort: 'updatedAt',
      },
    }));
    const { props } = await getServerSideProps();
    const { findByRole } = render(<ContribWelcome {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');
  });

  it('should fetch data via getServerSideProps', async () => {
    const { props: serverProps } = await getServerSideProps();
    expect(
      serverProps.contribWelcomeData.data.contrib_welcome.results.length,
    ).toEqual(3);
  });
});
