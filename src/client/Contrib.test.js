/* global testData */

import React from 'react';
import GoodFirstBugs from './ContribGoodFirstBugs';
import MaybeGoodFirstBugs from './ContribMaybeGoodFirstBugs';
import ContribWelcome from './ContribWelcome';
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
    fetchMock.mock(/\/api\/contrib-welcome\//, testData.contribWelcome);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some good first bugs', async () => {
    const fakeLocation = {
      pathname: '/contributions/good-first-bugs/',
    };

    const wrapper = mount(
      <MemoryRouter>
        <GoodFirstBugs location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('GoodFirstBugs').instance();
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

    const wrapper = mount(
      <MemoryRouter>
        <MaybeGoodFirstBugs location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('MaybeGoodFirstBugs').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.maybeGoodFirstBugs;
    const expectedNumberOfRows = Object.keys(issueData).length;
    expect(wrapper.find('tbody tr')).toHaveLength(expectedNumberOfRows);
  });

  it('should render some contrib welcome bugs', async () => {
    const fakeLocation = {
      pathname: '/contributions/contrib-welcome/',
    };

    const wrapper = mount(
      <MemoryRouter>
        <ContribWelcome location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('ContribWelcome').instance();
    await instance.componentDidMount();
    wrapper.update();
    const issueData = instance.state.contribWelcome;
    const expectedNumberOfRows = Object.keys(issueData).length;
    expect(wrapper.find('tbody tr')).toHaveLength(expectedNumberOfRows);
  });
});
