import { formatContribData } from 'lib/utils/contrib';

describe('lib/utils/contrib', () => {
  describe('formatContribData()', () => {
    const testIssues = [
      {
        issue: {
          state: 'OPEN',
          number: 1,
          updatedAt: '2019-08-16T15:27:22Z',
          title: 'Example issue title',
          url: 'https://example.com/issues/1',
          repository: {
            name: 'reponame',
          },
          labels: {
            nodes: [
              {
                name: 'priority: p1',
              },
              {
                name: 'contrib: assigned',
              },
            ],
          },
          assignees: {
            nodes: [
              {
                id: '367468234',
                name: 'User Name',
                login: 'example-username',
                avatarUrl: 'https://example.com/avatar/id/367468234',
              },
            ],
          },
        },
      },
      {
        issue: {
          state: 'OPEN',
          number: 2,
          updatedAt: '2019-08-16T15:27:22Z',
          title: 'Example issue title 2',
          url: 'https://example.com/issues/2',
          repository: {
            name: 'reponame',
          },
          labels: {
            nodes: [
              {
                name: 'priority: p2',
              },
              {
                name: 'contrib: mentor assigned',
              },
            ],
          },
          assignees: {
            nodes: [
              {
                id: '367468234',
                name: 'User Name',
                login: 'example-username',
                avatarUrl: 'https://example.com/avatar/id/367468234',
              },
            ],
          },
        },
      },
    ];

    it('adds assignment props to issues with assignment labels', () => {
      const formattedData = formatContribData(testIssues);
      expect(formattedData[0].assigned).toEqual(true);
      expect(formattedData[1].mentorAssigned).toEqual(true);
    });

    it('adds priority prop to issues with priority labels', () => {
      const formattedData = formatContribData(testIssues);
      expect(formattedData[0].priority).toEqual('p1');
      expect(formattedData[1].priority).toEqual('p2');
    });

    it('adds repo name to issue object', () => {
      const formattedData = formatContribData(testIssues);
      expect(formattedData[0].repo).toEqual('reponame');
    });
  });
});
