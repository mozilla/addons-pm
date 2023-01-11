export default {
  data: {
    maybe_good_first_bugs: {
      issueCount: 1,
      results: [
        {
          issue: {
            number: 3580,
            updatedAt: '2019-03-25T18:41:51Z',
            title: 'Hovering over an outgoing URL should show the URL',
            url: 'https://github.com/mozilla/addons-frontend/issues/3580',
            repository: {
              name: 'addons-frontend',
              __typename: 'Repository',
            },
            labels: {
              nodes: [
                {
                  name: 'contrib: maybe good first bug',
                  __typename: 'Label',
                },
                {
                  name: 'priority:p4',
                  __typename: 'Label',
                },
                {
                  name: 'project: amo',
                  __typename: 'Label',
                },
                {
                  name: 'triaged',
                  __typename: 'Label',
                },
              ],
              __typename: 'LabelConnection',
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
