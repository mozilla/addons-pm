/* eslint-disable jsx-a11y/anchor-is-valid */
import * as nextRouter from 'next/router';
import { cleanup, render, waitFor, screen } from '@testing-library/react';
import ActiveLink from 'components/ActiveLink';

describe('ActiveLink Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nextRouter.useRouter = jest.fn();
  });

  afterEach(cleanup);

  it('provides non-active link', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      route: '/',
      asPath: '/',
      prefetch: jest.fn(() => Promise.resolve()),
    }));
    render(
      <ActiveLink href="/whatever/" activeClassName="active">
        <a>test-link</a>
      </ActiveLink>,
    );
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/whatever/');
    expect(link).not.toHaveClass('active');
  });

  it('provides active link', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      route: '/whatever/',
      asPath: '/whatever/',
      prefetch: jest.fn(() => Promise.resolve()),
    }));
    render(
      <ActiveLink href="/whatever/" activeClassName="active">
        <a>test-link</a>
      </ActiveLink>,
    );
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/whatever/');
    expect(link).toHaveClass('active');
  });
});
