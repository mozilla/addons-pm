/* global testData */

import React from 'react';
import DashboardAMO from './DashboardAMO';
import { mount } from 'enzyme';

import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';

const fakeLocation = {
  pathname: '/dashboards/amo/',
};

describe('Dashboard', () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/github-issue-counts\//, testData.githubIssueCounts);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some projects', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <DashboardAMO location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('DashboardAMO').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.issueCounts;
    const expectedNumberOfDashGroups = Object.keys(issueData.data).length;
    expect(wrapper.find('.card-grp')).toHaveLength(expectedNumberOfDashGroups);
  });
});
