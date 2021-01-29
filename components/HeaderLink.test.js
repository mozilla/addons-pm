/* eslint-disable jsx-a11y/anchor-is-valid */
import * as nextRouter from 'next/router';
import React from 'react';
import { cleanup, render, waitFor, screen } from '@testing-library/react';

import HeaderLink from './HeaderLink';

describe('HeaderLink Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nextRouter.useRouter = jest.fn();
  });

  afterEach(cleanup);

  it('provides opposite sort direction if column matches', async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/foo/',
      query: {
        dir: 'asc',
        sort: 'assignee',
      },
    }));
    render(<HeaderLink columnKey="assignee" linkText="Assignee" />);
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/foo/?dir=desc&sort=assignee');
    expect(link).toHaveTextContent('Assignee');
  });

  it("provides default sort direction if column doesn't match", async () => {
    nextRouter.useRouter.mockImplementation(() => ({
      pathname: '/foo/',
      query: {
        dir: 'desc',
        sort: 'whatever',
      },
    }));
    render(<HeaderLink columnKey="assignee" linkText="Anything you want" />);
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/foo/?dir=desc&sort=assignee');
    expect(link).toHaveTextContent('Anything you want');
  });
});
