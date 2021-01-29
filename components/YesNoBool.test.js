import React from 'react';
import { render, screen } from '@testing-library/react';

import YesNoBool from './YesNoBool';

describe('YesNoBool Component', () => {
  it('renders YES', async () => {
    // eslint-disable-next-line react/jsx-boolean-value
    render(<YesNoBool bool={true} />);
    expect(screen.getByText('YES')).toHaveClass('yes');
  });

  it('renders NO', async () => {
    render(<YesNoBool bool={false} />);
    expect(screen.getByText('NO')).toHaveClass('no');
  });

  it('renders YES with extra classes', async () => {
    /* eslint-disable react/jsx-boolean-value */
    render(
      <YesNoBool
        bool={true}
        extraClasses={{ yes: ['one', 'two'], no: ['nope'] }}
      />,
    );
    /* eslint-enable react/jsx-boolean-value */
    const span = screen.getByText('YES');
    expect(span).toHaveClass('yes');
    expect(span).toHaveClass('one');
    expect(span).toHaveClass('two');
    expect(span).not.toHaveClass('nope');
  });

  it('renders NO with extra classes', async () => {
    render(
      <YesNoBool
        bool={false}
        extraClasses={{ no: ['one', 'two'], yes: ['nope'] }}
      />,
    );
    const span = screen.getByText('NO');
    expect(span).toHaveClass('no');
    expect(span).toHaveClass('one');
    expect(span).toHaveClass('two');
    expect(span).not.toHaveClass('nope');
  });
});
