export default {
  data: {
    search: {
      edges: [
        {
          node: {
            id: 'SomeId==',
            avatarUrl: 'https://avatars.githubusercontent.com/u/zzz?v=4',
            login: 'testuser-1',
            name: 'A User',
            __typename: 'User',
          },
          __typename: 'SearchResultItemEdge',
        },
        {
          node: {
            id: 'AnotherId==',
            avatarUrl: 'https://avatars.githubusercontent.com/u/yyyy?v=4',
            login: 'testuser-2',
            name: 'Another User',
            __typename: 'User',
          },
          __typename: 'SearchResultItemEdge',
        },
        {
          node: {
            id: 'AThirdId==',
            avatarUrl: 'https://avatars.githubusercontent.com/u/xxxx?v=4',
            login: 'testuser-3',
            name: 'A Third User',
            __typename: 'User',
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
