export const team = {
  data: {
    organization: {
      team: {
        members: {
          nodes: [
            {
              name: 'A user',
              login: 'team-testuser-1',
              avatarUrl: 'https://not-a-real-icon-service.com/testuser?v=3',
              __typename: 'User',
            },
            {
              name: 'Another user',
              login: 'team-testuser-2',
              avatarUrl: 'https://not-a-real-icon-service.com/testuser-2?v=3',
              __typename: 'User',
            },
          ],
          __typename: 'TeamMemberConnection',
        },
        __typename: 'Team',
      },
      outreachy: {
        members: {
          nodes: [
            {
              name: 'A user',
              login: 'team-testuser-1',
              avatarUrl: 'https://not-a-real-icon-service.com/testuser?v=3',
              __typename: 'User',
            },
            {
              name: 'Another user 3',
              login: 'team-testuser-3',
              avatarUrl: 'https://not-a-real-icon-service.com/testuser-3?v=3',
              __typename: 'User',
            },
          ],
          __typename: 'TeamMemberConnection',
        },
        __typename: 'Team',
      },
      __typename: 'Organization',
    },
  },
  loading: false,
  networkStatus: 7,
  stale: false,
};
