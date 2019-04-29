export const milestoneIssues = {
  data: {
    milestone_issues: {
      issueCount: 4,
      results: [
        {
          issue: {
            state: 'CLOSED',
            number: 11235,
            updatedAt: '2019-04-24T12:03:10Z',
            title: 'Test title',
            url: 'https://github.com/mozilla/addons-server/issues/11235',
            repository: {
              name: 'addons-server',
              __typename: 'Repository',
            },
            assignees: {
              nodes: [
                {
                  name: 'A test user',
                  login: 'testuser1',
                  avatarUrl:
                    'https://avatars2.githubusercontent.com/u/testuser?v=4',
                  __typename: 'User',
                },
              ],
              __typename: 'UserConnection',
            },
            labels: {
              nodes: [
                {
                  name: 'component: devhub',
                  __typename: 'Label',
                },
                {
                  name: 'component: themes',
                  __typename: 'Label',
                },
                {
                  name: 'priority: p3',
                  __typename: 'Label',
                },
                {
                  name: 'state: verified fixed',
                  __typename: 'Label',
                },
              ],
              __typename: 'LabelConnection',
            },
            projectCards: {
              nodes: [
                {
                  project: {
                    name: 'Add-ons Q2 2019: Static theme re-pack',
                    url: 'https://github.com/orgs/mozilla/projects/81',
                    __typename: 'Project',
                  },
                  __typename: 'ProjectCard',
                },
              ],
              __typename: 'ProjectCardConnection',
            },
            __typename: 'Issue',
          },
          __typename: 'SearchResultItemEdge',
        },
        {
          issue: {
            state: 'CLOSED',
            number: 1111,
            updatedAt: '2019-04-20T09:47:17Z',
            title: 'Test title 2',
            url: 'https://github.com/mozilla/addons-frontend/issues/1111',
            repository: {
              name: 'addons-frontend',
              __typename: 'Respository',
            },
            assignees: {
              nodes: [
                {
                  name: 'A test user 2',
                  login: 'testuser2',
                  avatarUrl:
                    'https://avatars2.githubusercontent.com/u/testuser2?v=4',
                  __typename: 'User',
                },
              ],
              __typename: 'UserConnection',
            },
            labels: {
              nodes: [
                {
                  name: 'priority: p3',
                  __typename: 'Label',
                },
                {
                  name: 'state: wontfix',
                  __typename: 'Label',
                },
              ],
              __typename: 'LabelConnection',
            },
            projectCards: {
              nodes: [
                {
                  project: {
                    name: 'Add-ons Q2 2019: Static theme re-pack',
                    url: 'https://github.com/orgs/mozilla/projects/81',
                    __typename: 'Project',
                  },
                  __typename: 'ProjectCard',
                },
              ],
              __typename: 'ProjectCardConnection',
            },
            __typename: 'Issue',
          },
          __typename: 'SearchResultItemEdge',
        },
        {
          issue: {
            state: 'CLOSED',
            number: 1112,
            updatedAt: '2019-04-22T14:06:51Z',
            title: 'Test title 3',
            url: 'https://github.com/mozilla/addons-frontend/issues/1112',
            repository: {
              name: 'addons-frontend',
              __typename: 'Repository',
            },
            assignees: {
              nodes: [
                {
                  name: 'A test user 2',
                  login: 'testuser2',
                  avatarUrl:
                    'https://avatars2.githubusercontent.com/u/testuser2?v=4',
                  __typename: 'User',
                },
              ],
              __typename: 'UserConnection',
            },
            labels: {
              nodes: [
                {
                  name: 'contrib: assigned',
                  __typename: 'Label',
                },
                {
                  name: 'state: wontfix',
                  __typename: 'Label',
                },
              ],
              __typename: 'LabelConnection',
            },
            projectCards: {
              nodes: [
                {
                  project: {
                    name: 'Test Title 4',
                    url: 'https://github.com/orgs/mozilla/projects/81',
                    __typename: 'Project',
                  },
                  __typename: 'ProjectCard',
                },
              ],
              __typename: 'ProjectCardConnection',
            },
            __typename: 'Issue',
          },
          __typename: 'SearchResultItemEdge',
        },
        {
          issue: {
            state: 'CLOSED',
            number: 1113,
            updatedAt: '2019-04-23T09:23:53Z',
            title: 'Test title 4',
            url: 'https://github.com/mozilla/addons-frontend/issues/1113',
            repository: {
              name: 'addons-frontend',
              __typename: 'Respository',
            },
            assignees: {
              nodes: [],
              __typename: 'UserConnection',
            },
            labels: {
              nodes: [
                {
                  name: 'state: verified fixed',
                  __typename: 'Label',
                },
              ],
              __typename: 'LabelConnection',
            },
            projectCards: {
              nodes: [],
              __typename: 'ProjectCardConnection',
            },
            __typename: 'Issue',
          },
          __typename: 'SearchResultItemEdge',
        },
      ],
      __typename: 'SearchResultItemConnection',
    },
  },
  loading: false,
  networkStatus: 7,
  stale: false,
};
