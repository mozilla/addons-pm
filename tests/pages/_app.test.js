/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import MyApp from 'pages/_app';

function FakeComponent() {
  return <div>test</div>;
}

describe(__filename, () => {
  beforeEach(() => {
    React.useEffect = jest.fn();
  });

  it('should render the main app page', async () => {
    const { getAllByTestId } = render(<MyApp Component={FakeComponent} />);
    const wrapper = await getAllByTestId('app-wrapper');
    expect(wrapper).toHaveLength(1);
  });
});
