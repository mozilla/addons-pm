/**
 * @jest-environment jsdom
 */

import mockRouter from 'next-router-mock';
import { cleanup, render, waitFor, screen } from '@testing-library/react';
import ActiveLink from 'components/ActiveLink';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe(__filename, () => {
  afterEach(cleanup);

  it('provides non-active link', async () => {
    render(
      <ActiveLink href="/whatever" activeClassName="active">
        <a>test-link</a>
      </ActiveLink>,
    );
    const link = await waitFor(() => screen.getByRole('link'));
    expect(link).toHaveAttribute('href', '/whatever/');
    expect(link).not.toHaveClass('active');
  });

  it('provides active link', async () => {
    mockRouter.setCurrentUrl('/whatever');
    render(
      <ActiveLink href="/whatever" activeClassName="active">
        <a>test-link</a>
      </ActiveLink>,
    );
    const link = await waitFor(() => screen.getByRole('link'));
    expect(link).toHaveAttribute('href', '/whatever/');
    expect(link).toHaveClass('active');
  });
});
