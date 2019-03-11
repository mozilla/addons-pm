import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.fetch = require('fetch-mock');
global.requestAnimationFrame = function(callback) {
  window.setTimeout(callback, 0);
};

global.testData = {
  issueCounts: {
    data: {
      addons: {
        description: '☂ Umbrella repository for Mozilla Addons ✨',
        total_issues: {
          totalCount: 108,
        },
        triaged: {
          totalCount: 102,
        },
        open_p1s: {
          totalCount: 0,
        },
        open_p2s: {
          totalCount: 2,
        },
        open_prs: {
          totalCount: 0,
        },
      },
      addons_server: {
        description: '🕶 addons.mozilla.org Django app and API 🎉',
        total_issues: {
          totalCount: 397,
        },
        triaged: {
          totalCount: 380,
        },
        open_p1s: {
          totalCount: 0,
        },
        open_p2s: {
          totalCount: 1,
        },
        open_prs: {
          totalCount: 3,
        },
      },
      addons_frontend: {
        description: 'Front-end to complement mozilla/addons-server',
        total_issues: {
          totalCount: 361,
        },
        triaged: {
          totalCount: 357,
        },
        open_p1s: {
          totalCount: 0,
        },
        open_p2s: {
          totalCount: 3,
        },
        open_prs: {
          totalCount: 10,
        },
      },
      addons_linter: {
        description: '🔍 Firefox Add-ons linter, written in JavaScript. 👁',
        total_issues: {
          totalCount: 98,
        },
        triaged: {
          totalCount: 86,
        },
        open_p1s: {
          totalCount: 0,
        },
        open_p2s: {
          totalCount: 0,
        },
        open_prs: {
          totalCount: 2,
        },
      },
      addons_code_manager: {
        description: 'A web application to manage add-on source code',
        total_issues: {
          totalCount: 54,
        },
        triaged: {
          totalCount: 53,
        },
        open_p1s: {
          totalCount: 0,
        },
        open_p2s: {
          totalCount: 0,
        },
        open_prs: {
          totalCount: 10,
        },
      },
    },
    loading: false,
    networkStatus: 7,
    stale: false,
  },
  team: {
    data: {
      organization: {
        team: {
          members: {
            nodes: [
              {
                name: 'A user',
                login: 'testuser',
                avatarUrl: 'https://not-a-real-icon-service.com/testuser?v=3',
              },
              {
                name: 'Another user',
                login: 'testUser-2',
                avatarUrl: 'https://not-a-real-icon-service.com/testuser-2?v=3',
              },
            ],
          },
        },
      },
    },
  },
  projects: {
    data: {
      organization: {
        projects: {
          totalCount: 15,
          nodes: [
            {
              name: 'Add-ons Q3 2018: Test Project 1',
              state: 'OPEN',
              url: 'https://github.com/orgs/mozilla/projects/2',
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
              updatedAt: '2018-09-18T15:56:15Z',
              columns: {
                edges: [
                  {
                    node: {
                      id: 'id1',
                      name: 'To do',
                      cards: {
                        totalCount: 10,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id2',
                      name: 'In progress',
                      cards: {
                        totalCount: 1,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id3',
                      name: 'Done',
                      cards: {
                        totalCount: 6,
                      },
                    },
                  },
                ],
              },
            },
            {
              name: 'Add-ons Q3 2018: Test Project 2',
              state: 'OPEN',
              url: 'https://github.com/orgs/mozilla/projects/2',
              bodyHTML: 'My Project Data HTML 2',
              updatedAt: '2018-08-18T15:55:15Z',
              columns: {
                edges: [
                  {
                    node: {
                      id: 'id1',
                      name: 'To do',
                      cards: {
                        totalCount: 5,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id2',
                      name: 'In progress',
                      cards: {
                        totalCount: 5,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id3',
                      name: 'Done',
                      cards: {
                        totalCount: 5,
                      },
                    },
                  },
                ],
              },
            },
            {
              name: 'Add-ons Q3 2018: Test Project 3',
              state: 'OPEN',
              url: 'https://github.com/orgs/mozilla/projects/3',
              bodyHTML: `My Project Data HTML
								<details>
									<summary>Project Metadata</summary>
									<dl>
									  <dt>Engineering</dt>
										<dd>@testuser-2</dd>
										<dt>Goal Type</dt>
										<dd>Secondary</dd>
									</dl>
								</details>`,
              updatedAt: '2018-08-18T13:56:15Z',
              columns: {
                edges: [
                  {
                    node: {
                      id: 'id1',
                      name: 'To do',
                      cards: {
                        totalCount: 1,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id2',
                      name: 'In progress',
                      cards: {
                        totalCount: 1,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id3',
                      name: 'Done',
                      cards: {
                        totalCount: 6,
                      },
                    },
                  },
                ],
              },
            },
            {
              name: 'Add-ons Q3 2018: Test Project 4',
              state: 'OPEN',
              url: 'https://github.com/orgs/mozilla/projects/4',
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
              updatedAt: '2018-07-18T13:56:15Z',
              columns: {
                edges: [
                  {
                    node: {
                      id: 'id1',
                      name: 'To do',
                      cards: {
                        totalCount: 3,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id2',
                      name: 'In progress',
                      cards: {
                        totalCount: 4,
                      },
                    },
                  },
                  {
                    node: {
                      id: 'id3',
                      name: 'Done',
                      cards: {
                        totalCount: 6,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};
