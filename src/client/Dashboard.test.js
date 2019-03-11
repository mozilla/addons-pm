/* global testData */

import React from 'react';
import Dashboard from './Dashboard';
import { mount } from 'enzyme';

import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';

const fakeLocation = {
  pathname: '/dashboard/',
};

describe('Dashboard', () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/issue-counts\//, testData.issueCounts);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some projects', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <Dashboard location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Dashboard').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.issueCounts;
    const expectedNumberOfDashGroups = Object.keys(issueData.data).length;
    expect(wrapper.find('.card-grp')).toHaveLength(expectedNumberOfDashGroups);
  });
});
