/* global testData */

import React from 'react';
import Milestones from './Milestones';
import { mount } from 'enzyme';

import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';

const fakeLocation = {
  pathname: '/2019.04.25/',
};

const fakeMatch = {
  params: {
    year: '2019',
    month: '04',
    day: '25',
  },
};

describe('Milestones', () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/milestone-issues\//, testData.milestoneIssues);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render a milestone table', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <Milestones location={fakeLocation} match={fakeMatch} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Milestones').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.milestoneIssues;
    const expectedNumberOfRows = Object.keys(issueData).length;
    expect(wrapper.find('tbody tr')).toHaveLength(expectedNumberOfRows);
  });
});
