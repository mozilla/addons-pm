/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import Home from 'pages/index';

describe(__filename, () => {
  it('should render the home page', async () => {
    const { findAllByRole, findAllByText } = render(<Home />);
    const container = await findAllByRole('main');
    expect(container).toHaveLength(1);

    const cardGroups = await findAllByText(/.*?/, { selector: '.card' });
    expect(cardGroups).toHaveLength(4);
  });
});
