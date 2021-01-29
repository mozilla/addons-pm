import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';

import DashCount from './DashCount';

describe('DashCount Component', () => {
  const testData = {
    link: 'https://example.com/link',
    title: 'title',
    warning: false,
    count: 10,
  };

  it('renders count data', async () => {
    render(<DashCount {...testData} />);
    await waitFor(() => screen.getByRole('link'));
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.com/link',
    );
    expect(screen.getByTestId('dashcount-count')).toHaveTextContent('10');
    expect(screen.getByTestId('dashcount-svg-wrapper')).toHaveClass('outer');
    expect(screen.getByTestId('dashcount-svg-wrapper')).not.toHaveClass(
      'warning',
    );
  });

  it('renders count data with warning', async () => {
    render(<DashCount {...testData} warning />);
    await waitFor(() => screen.getByRole('link'));
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.com/link',
    );
    expect(screen.getByTestId('dashcount-count')).toHaveTextContent('10');
    expect(screen.getByTestId('dashcount-svg-wrapper')).toHaveClass('outer');
    expect(screen.getByTestId('dashcount-svg-wrapper')).toHaveClass('warning');
  });
});
