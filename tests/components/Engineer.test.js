import { render, waitFor, screen } from '@testing-library/react';
import Engineer from 'components/Engineer';

describe(__filename, () => {
  const testMember = {
    avatarUrl: 'https://example.com/testuser',
    login: 'jane bloggs',
  };

  it('loads engineer link', async () => {
    render(<Engineer year={2020} quarter="Q1" member={testMember} />);
    await waitFor(() => screen.getByRole('link'));
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/projects/2020/Q1/?engineer=jane%20bloggs',
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      testMember.avatarUrl,
    );
  });
});
