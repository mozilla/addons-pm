/* global testData */

import React from 'react';
import Contrib from './Contrib';
import { mount } from 'enzyme';

import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';

describe('Contributions', () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/good-first-bugs\//, testData.goodFirstBugs);
    fetchMock.mock(
      /\/api\/maybe-good-first-bugs\//,
      testData.maybeGoodFirstBugs,
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some good first bugs', async () => {
    const fakeLocation = {
      pathname: '/contributions/good-first-bugs/',
    };

    const fakeMatch = {
      params: {
        type: 'good-first-bugs',
      },
    };

    const wrapper = mount(
      <MemoryRouter>
        <Contrib location={fakeLocation} match={fakeMatch} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Contrib').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.goodFirstBugs;
    const expectedNumberOfRows = Object.keys(issueData).length;
    expect(wrapper.find('tbody tr')).toHaveLength(expectedNumberOfRows);
  });

  it('should render some maybe good first bugs', async () => {
    const fakeLocation = {
      pathname: '/contributions/maybe-good-first-bugs/',
    };

    const fakeMatch = {
      params: {
        type: 'maybe-good-first-bugs',
      },
    };

    const wrapper = mount(
      <MemoryRouter>
        <Contrib location={fakeLocation} match={fakeMatch} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Contrib').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.maybeGoodFirstBugs;
    const expectedNumberOfRows = Object.keys(issueData).length;
    expect(wrapper.find('tbody tr')).toHaveLength(expectedNumberOfRows);
  });
});
