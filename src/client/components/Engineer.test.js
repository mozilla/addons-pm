/* global testData */

import React from 'react';
import { shallow } from 'enzyme';

import Engineer from './Engineer';

describe('Projects Page', () => {
  it('should lowercase user slug in links', async () => {
    const fakeProps = {
      member: testData.team.data.organization.team.members.nodes[1],
      quarter: 'Q3',
      year: '2018',
    };
    const eng = shallow(<Engineer {...fakeProps} />);
    expect(eng.find('Link').prop('to')).toBe('/2018/Q3/team-testuser-2/');
  });
});
