export const projects = {
  data: {
    organization: {
      projects: {
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
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id2',
                    name: 'In progress',
                    cards: {
                      totalCount: 1,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id3',
                    name: 'Done',
                    cards: {
                      totalCount: 6,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
              ],
              __typename: 'ProjectColumnConnection',
            },
            __typename: 'Project',
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
                    id: 'id4',
                    name: 'To do',
                    cards: {
                      totalCount: 5,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id5',
                    name: 'In progress',
                    cards: {
                      totalCount: 5,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id6',
                    name: 'Done',
                    cards: {
                      totalCount: 5,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
              ],
              __typename: 'ProjectColumnConnection',
            },
            __typename: 'Project',
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
                    id: 'id7',
                    name: 'To do',
                    cards: {
                      totalCount: 1,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id8',
                    name: 'In progress',
                    cards: {
                      totalCount: 1,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id9',
                    name: 'Done',
                    cards: {
                      totalCount: 6,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
              ],
              __typename: 'ProjectColumnConnection',
            },
            __typename: 'Project',
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
                    id: 'id10',
                    name: 'To do',
                    cards: {
                      totalCount: 3,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id11',
                    name: 'In progress',
                    cards: {
                      totalCount: 4,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
                {
                  node: {
                    id: 'id12',
                    name: 'Done',
                    cards: {
                      totalCount: 6,
                      __typename: 'ProjectCardConnection',
                    },
                    __typename: 'ProjectColumn',
                  },
                  __typename: 'ProjectColumnEdge',
                },
              ],
              __typename: 'ProjectColumnConnection',
            },
            __typename: 'Project',
          },
        ],
        __typename: 'ProjectConnection',
      },
      __typename: 'Organization',
    },
  },
  loading: false,
  networkStatus: 7,
  stale: false,
};
