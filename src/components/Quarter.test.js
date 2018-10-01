import React from 'react';
import { shallow } from 'enzyme';

import { Quarter } from './Quarter';

describe('Quarter', () => {
  it('should render Quarter without error', () => {
    const wrapper = shallow(<Quarter year="2018" />);
    expect(wrapper.find('li').length).toBe(4);
  });

  it('should render active year', () => {
    const wrapper = shallow(<Quarter year="2018" currentYear="2018" />);
    expect(wrapper.find('h3').prop('className')).toBe('active-year');
  });

  it('should render active quarter', () => {
    const wrapper = shallow(<Quarter year="2018" currentQuarter="3" />);
    expect(wrapper.find('.active-date').childAt(0).text()).toBe('Q3');
  });

  it('should throw if invalid year', () => {
    expect(() => {
      shallow(<Quarter year="201kfdjhf" />);
    }).toThrowError(/Invalid year/);
  });
});

