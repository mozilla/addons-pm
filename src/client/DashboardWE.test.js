/* global testData */

import React from 'react';
import DashboardWE from './DashboardWE';
import { mount } from 'enzyme';

import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';

const fakeLocation = {
  pathname: '/dashboards/webext/',
};

describe('Webext Dashboard', () => {
  beforeEach(() => {
    fetchMock.mock(
      /\/api\/bugzilla-issue-counts\//,
      testData.bugzillaIssueCountsLocal,
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some projects', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <DashboardWE location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('DashboardWE').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.issueCounts;
    const expectedNumberOfDashGroups = Object.keys(issueData).length;
    expect(wrapper.find('.card-grp')).toHaveLength(expectedNumberOfDashGroups);
  });
});
