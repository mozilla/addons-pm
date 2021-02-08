import { render, waitFor, screen } from '@testing-library/react';
import DashCountGroup from 'components/DashCountGroup';

describe('DashCountGroup Component', () => {
  const testData = {
    className: 'test-class',
    title: 'test title',
    description: 'test description',
  };

  it('renders a dashcount group', async () => {
    render(<DashCountGroup {...testData} />);
    await waitFor(() => screen.getByTestId('dashcountgroup'));
    const dashCountGroupContainer = screen.getByTestId('dashcountgroup');
    expect(dashCountGroupContainer).toHaveClass('test-class');
    const dashCountGroupTitle = screen.getByTestId('dashcountgroup-title');
    expect(dashCountGroupTitle).toHaveTextContent(testData.title);
    const dashCountGroupDescription = screen.getByTestId('dashcountgroup-desc');
    expect(dashCountGroupDescription).toHaveTextContent(testData.description);
  });
});
