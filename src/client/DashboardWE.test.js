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
    fetchMock.mock(
      /\/api\/bugzilla-need-infos\//,
      testData.bugzillaNeedsInfoLocal,
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
    // All the dashgroups.
    expect(wrapper.find('.card-grp')).toHaveLength(4);
    // The needinfo group.
    expect(wrapper.find('.card-grp.needinfos')).toHaveLength(1);
  });
});
