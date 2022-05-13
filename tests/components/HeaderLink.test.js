/**
 * @jest-environment jsdom
 */

import mockRouter from 'next-router-mock';
import { cleanup, render, waitFor, screen } from '@testing-library/react';
import HeaderLink from 'components/HeaderLink';

// eslint-disable-next-line global-require
jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  afterEach(cleanup);

  it('provides opposite sort direction if column matches', async () => {
    mockRouter.setCurrentUrl('/foo/?dir=asc&sort=assignee');
    render(<HeaderLink columnKey="assignee" linkText="Assignee" />);
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/foo/?dir=desc&sort=assignee');
    expect(link).toHaveTextContent('Assignee');
  });

  it("provides default sort direction if column doesn't match", async () => {
    mockRouter.setCurrentUrl('/foo/?dir=desc&sort=whatever');
    render(<HeaderLink columnKey="assignee" linkText="Anything you want" />);
    await waitFor(() => screen.getByRole('link'));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/foo/?dir=desc&sort=assignee');
    expect(link).toHaveTextContent('Anything you want');
  });
});
