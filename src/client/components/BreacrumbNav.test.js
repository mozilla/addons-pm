import React from 'react';
import { shallow } from 'enzyme';

import { BreadcrumbNav } from './BreadcrumbNav';

function getFakeRouterParams({ pathname = '/2018/Q3/', params = {} } = {}) {
  const defaultParams = {
    year: '2018',
    quarter: 'Q3',
    projectType: null,
    engineerUrl: null,
  };

  return {
    location: {
      pathname,
      search: '',
      hash: '',
      state: undefined,
    },
    match: {
      params: { ...defaultParams, ...params },
    },
  };
}

describe('BreadcrumbNav', () => {
  it('should render BreadcrumbNav without error', () => {
    const wrapper = shallow(<BreadcrumbNav {...getFakeRouterParams()} />);
    expect(wrapper.find('withRouter(LinkContainer)').length).toBe(3);
  });

  it('should render engineer', () => {
    const wrapper = shallow(
      <BreadcrumbNav
        {...getFakeRouterParams({
          pathname: '/2018/Q3/willdurand/',
          params: {
            quarter: 'Q3',
            year: '2018',
            engineer: 'willdurand',
          },
        })}
      />,
    );
    expect(wrapper.find('withRouter(LinkContainer)[to="/"]').length).toBe(1);
    expect(wrapper.find('withRouter(LinkContainer)[to="/2018/"]').length).toBe(
      1,
    );
    expect(
      wrapper.find('withRouter(LinkContainer)[to="/2018/Q3/"]').length,
    ).toBe(1);
    expect(
      wrapper.find('withRouter(LinkContainer)[to="/2018/Q3/willdurand/"]')
        .length,
    ).toBe(1);
  });

  it('should render primary', () => {
    const wrapper = shallow(
      <BreadcrumbNav
        {...getFakeRouterParams({
          pathname: '/2018/Q3/primary/',
          params: {
            quarter: 'Q3',
            year: '2018',
            projectType: 'primary',
          },
        })}
      />,
    );
    expect(wrapper.find('withRouter(LinkContainer)[to="/"]').length).toBe(1);
    expect(wrapper.find('withRouter(LinkContainer)[to="/2018/"]').length).toBe(
      1,
    );
    expect(
      wrapper.find('withRouter(LinkContainer)[to="/2018/Q3/"]').length,
    ).toBe(1);
    expect(
      wrapper.find('withRouter(LinkContainer)[to="/2018/Q3/primary/"]').length,
    ).toBe(1);
  });

  it('should render no quarter if missing', () => {
    const wrapper = shallow(
      <BreadcrumbNav
        {...getFakeRouterParams({
          pathname: '/2018/',
          params: {
            quarter: undefined,
          },
        })}
      />,
    );
    expect(wrapper.find('withRouter(LinkContainer)[to="/"]').length).toBe(1);
    expect(wrapper.find('withRouter(LinkContainer)[to="/2018/"]').length).toBe(
      1,
    );
    expect(
      wrapper
        .find('withRouter(LinkContainer)[to="/2018/"]')
        .childAt(0)
        .prop('active'),
    ).toBe(true);
    expect(
      wrapper.find('withRouter(LinkContainer)[to="/2018/Q3/"]').length,
    ).toBe(0);
  });

  it('should render no year if missing', () => {
    const wrapper = shallow(
      <BreadcrumbNav
        {...getFakeRouterParams({
          pathname: '/',
          params: {
            quarter: undefined,
            year: undefined,
          },
        })}
      />,
    );
    expect(wrapper.find('withRouter(LinkContainer)[to="/"]').length).toBe(1);
    expect(
      wrapper
        .find('withRouter(LinkContainer)[to="/"]')
        .childAt(0)
        .prop('active'),
    ).toBe(true);
    expect(wrapper.find('withRouter(LinkContainer)[to="/2018/"]').length).toBe(
      0,
    );
    expect(
      wrapper.find('withRouter(LinkContainer)[to="/2018/Q3/"]').length,
    ).toBe(0);
  });
});
