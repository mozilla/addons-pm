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
  }
}

describe('Projects Page', () => {

  beforeEach(() => {

    // Set up some mock team data.
    fetchMock.mock(/\/api\/team\//, {
      "data": {
        "organization": {
          "team": {
            "members": {
              "nodes": [
                {
                  "name": "A user",
                  "login": "testuser",
                  "avatarUrl": "https://not-a-real-icon-service.com/testuser?v=3"
                },
                {
                  "name": "Another user",
                  "login": "testuser-2",
                  "avatarUrl": "https://not-a-real-icon-service.com/testuser-2?v=3"
                }
              ],
            },
          },
        },
      },
    });

    // Setup some mock project data
    fetchMock.mock(/\/api\/projects\//, {
      data: {
        organization: {
          projects: {
            totalCount: 15,
            nodes: [
              {
                name: "Add-ons Q3 2018: Test Project 1",
                state: "OPEN",
                url: "https://github.com/orgs/mozilla/projects/2",
                bodyHTML: `My Project Data HTML
									<details>
										<summary>Project Metadata</summary>
										<dl>
										  <dt>Engineering</dt>
											<dd>@testuser</dd>
											<dt>Goal Type</dt>
											<dd>Primary</dd>
										</dl>
									</details>`,
                updatedAt: "2018-09-18T15:56:15Z",
                columns: {
                  edges: [
                    {
                      node: {
                        id: "id1",
                        name: "To do",
                        cards: {
                          totalCount: 10
                        }
                      }
                    },
                    {
                      node: {
                        id: "id2",
                        name: "In progress",
                        cards: {
                          totalCount: 1
                        }
                      }
                    },
                    {
                      node: {
                        id: "id3",
                        name: "Done",
                        cards: {
                          totalCount: 6
                        }
                      }
                    }
                  ]
                }
              },
              {
                name: "Add-ons Q3 2018: Test Project 2",
                state: "OPEN",
                url: "https://github.com/orgs/mozilla/projects/2",
                bodyHTML: "My Project Data HTML 2",
                updatedAt: "2018-08-18T15:55:15Z",
                columns: {
                  edges: [
                    {
                      node: {
                        id: "id1",
                        name: "To do",
                        cards: {
                          totalCount: 5
                        }
                      }
                    },
                    {
                      node: {
                        id: "id2",
                        name: "In progress",
                        cards: {
                          totalCount: 5
                        }
                      }
                    },
                    {
                      node: {
                        id: "id3",
                        name: "Done",
                        cards: {
                          totalCount: 5
                        }
                      }
                    }
                  ]
                }
              },
              {
                name: "Add-ons Q3 2018: Test Project 3",
                state: "OPEN",
                url: "https://github.com/orgs/mozilla/projects/3",
                bodyHTML: `My Project Data HTML
									<details>
										<summary>Project Metadata</summary>
										<dl>
										  <dt>Engineering</dt>
											<dd>@testuser</dd>
											<dt>Goal Type</dt>
											<dd>Secondary</dd>
										</dl>
									</details>`,
                updatedAt: "2018-08-18T13:56:15Z",
                columns: {
                  edges: [
                    {
                      node: {
                        id: "id1",
                        name: "To do",
                        cards: {
                          totalCount: 1
                        }
                      }
                    },
                    {
                      node: {
                        id: "id2",
                        name: "In progress",
                        cards: {
                          totalCount: 1
                        }
                      }
                    },
										{
                      node: {
                        id: "id3",
                        name: "Done",
                        cards: {
                          totalCount: 6
                        }
                      }
                    }
                  ]
                }
              },
              {
                name: "Add-ons Q3 2018: Test Project 4",
                state: "OPEN",
                url: "https://github.com/orgs/mozilla/projects/4",
                bodyHTML: `My Project Data HTML
									<details>
										<summary>Project Metadata</summary>
										<dl>
										  <dt>Engineering</dt>
											<dd>@testuser-2</dd>
											<dt>Goal Type</dt>
											<dd>Wrong</dd>
										</dl>
									</details>`,
                updatedAt: "2018-07-18T13:56:15Z",
                columns: {
                  edges: [
                    {
                      node: {
                        id: "id1",
                        name: "To do",
                        cards: {
                          totalCount: 3
                        }
                      }
                    },
                    {
                      node: {
                        id: "id2",
                        name: "In progress",
                        cards: {
                          totalCount: 4
                        }
                      }
                    },
										{
                      node: {
                        id: "id3",
                        name: "Done",
                        cards: {
                          totalCount: 6
                        }
                      }
                    }
                  ]
                }
              },

            ],
          },
        },
      }
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render some projects', async () => {
    const wrapper = mount(
			<MemoryRouter>
				<Projects match={fakeMatch} location={fakeLocation} />
			</MemoryRouter>,
			{ disableLifecycleMethods: true }
		);
		const instance = wrapper.find('Projects').instance();
    await instance.componentDidMount();
    wrapper.update();
		const projectData = instance.state.projects;
    const expectedNumberOfProjects = projectData.data.organization.projects.nodes.length;
    expect(wrapper.find('.card-wrapper')).toHaveLength(expectedNumberOfProjects);
  });

  it('should filter projects by type', async () => {
		const filteredMatch = { ...fakeMatch };
		filteredMatch.params = { ...fakeMatch.params, projectType: "primary" };
		const filteredLocation = { pathname: '/2018/Q3/primary/' };
    const wrapper = mount(
			<MemoryRouter>
				<Projects match={filteredMatch} location={filteredLocation} />
			</MemoryRouter>,
			{ disableLifecycleMethods: true }
		);
		const instance = wrapper.find('Projects').instance();
    await instance.componentDidMount();
    wrapper.update();
    expect(wrapper.find('.card-wrapper')).toHaveLength(1);
  });

  it('should filter projects by engineer', async () => {
		const filteredMatch = { ...fakeMatch };
		filteredMatch.params = { ...fakeMatch.params, engineer: "testuser" };
		const filteredLocation = { pathname: '/2018/Q3/testuser/' };
    const wrapper = mount(
			<MemoryRouter>
				<Projects match={filteredMatch} location={filteredLocation} />
			</MemoryRouter>,
			{ disableLifecycleMethods: true }
		);
		const instance = wrapper.find('Projects').instance();
    await instance.componentDidMount();
    wrapper.update();
    expect(wrapper.find('.card-wrapper')).toHaveLength(2);
  });
});

