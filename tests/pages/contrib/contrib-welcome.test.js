/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';
import mockRouter from 'next-router-mock';
import ghContribWelcomeData from 'tests/fixtures/gh-contrib-welcome';
import { cleanup, render } from '@testing-library/react';
import ContribWelcome, {
  getServerSideProps,
} from 'pages/contrib/contrib-welcome';

jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/gh-contrib-welcome\//, ghContribWelcomeData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the Contrib Welcome Page', async () => {
    mockRouter.setCurrentUrl("/contrib/contrib-welcome/?dir=asc&sort=updatedAt");
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
