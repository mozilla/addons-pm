/* global testData */

import React from 'react';
import Projects from './Projects';
import { mount } from 'enzyme';

import fetchMock from 'fetch-mock';
import { MemoryRouter } from 'react-router-dom';

const fakeLocation = {
  pathname: '/2018/Q3/',
};

const fakeMatch = {
  params: {
    year: '2018',
    quarter: 'Q3',
  },
};

describe('Projects Page', () => {
  beforeEach(() => {
    //  Mock API data
    fetchMock.mock(/\/api\/team\//, testData.team);
    fetchMock.mock(/\/api\/projects\//, testData.projects);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some projects', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <Projects match={fakeMatch} location={fakeLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Projects').instance();
    await instance.componentDidMount();
    wrapper.update();
    const projectData = instance.state.projects;
    const expectedNumberOfProjects =
      projectData.data.organization.projects.nodes.length;
    expect(wrapper.find('.card-wrapper')).toHaveLength(
      expectedNumberOfProjects,
    );
  });

  it('should filter projects by type', async () => {
    const filteredMatch = { ...fakeMatch };
    filteredMatch.params = { ...fakeMatch.params, projectType: 'primary' };
    const filteredLocation = { pathname: '/2018/Q3/primary/' };
    const wrapper = mount(
      <MemoryRouter>
        <Projects match={filteredMatch} location={filteredLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Projects').instance();
    await instance.componentDidMount();
    wrapper.update();
    expect(wrapper.find('.card-wrapper')).toHaveLength(1);
  });

  it('should filter projects by engineer', async () => {
    const filteredMatch = { ...fakeMatch };
    filteredMatch.params = { ...fakeMatch.params, engineer: 'testuser' };
    const filteredLocation = { pathname: '/2018/Q3/testuser/' };
    const wrapper = mount(
      <MemoryRouter>
        <Projects match={filteredMatch} location={filteredLocation} />
      </MemoryRouter>,
      { disableLifecycleMethods: true },
    );
    const instance = wrapper.find('Projects').instance();
    await instance.componentDidMount();
    wrapper.update();
    expect(wrapper.find('.card-wrapper')).toHaveLength(1);
  });
});
