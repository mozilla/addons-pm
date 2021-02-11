import * as nextRouter from 'next/router';
import { cleanup, render, waitFor, screen } from '@testing-library/react';
import HeaderLink from 'components/HeaderLink';

describe(__filename, () => {
  beforeEach(() => {
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
      prefetch: jest.fn(() => Promise.resolve()),
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
      prefetch: jest.fn(() => Promise.resolve()),
    }));
    render(<HeaderLink columnKey="assignee" linkText="Anything you want" />);
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/foo/?dir=desc&sort=assignee');
    expect(link).toHaveTextContent('Anything you want');
  });
});
