import {
  formatDateToMilestone,
  formatIssueData,
  getMilestonePagination,
  getNextMilestone,
  setAssigneeProp,
  setIsContribProp,
  setIssuePriorityProp,
  setProjectProps,
  setStateLabels,
  setRepoProp,
  setReviewerDetails,
} from 'lib/utils/milestones';
import { colors } from 'lib/const';

describe('Milestone Utils', () => {
  describe('getNextMilestone()', () => {
    it('gets the next nearest Thursday', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '9');
      const nextMilestone = getNextMilestone({ startDate, dayOfWeek: 4 });
      expect(formatDateToMilestone(nextMilestone)).toEqual('2019-04-11');
    });

    it('gets the next nearest Thursday when start date is Thursday', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '11');
      const nextMilestone = getNextMilestone({ startDate, dayOfWeek: 4 });
      expect(formatDateToMilestone(nextMilestone)).toEqual('2019-04-11');
    });

    it('gets the next nearest Monday', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '11');
      const nextMilestone = getNextMilestone({ startDate, dayOfWeek: 1 });
      expect(formatDateToMilestone(nextMilestone)).toEqual('2019-04-15');
    });
  });

  describe('formatDateToMilestone()', () => {
    it('zero fills months and days', () => {
      const startDate = new Date('2019', '3', '9');
      expect(formatDateToMilestone(startDate)).toEqual('2019-04-09');
    });

    it(`doesn't zero fill months and days when not needed`, () => {
      const startDate = new Date('2019', '11', '15');
      expect(formatDateToMilestone(startDate)).toEqual('2019-12-15');
    });
  });

  describe('getMilestonePagination()', () => {
    it('gets pagination based on a specific start date', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '9');
      const milestonePagination = getMilestonePagination({
        startDate,
        dayOfWeek: 4,
      });
      expect(milestonePagination.prevFromStart).toEqual('2019-04-04');
      expect(milestonePagination.start).toEqual('2019-04-09');
      expect(milestonePagination.nextFromStart).toEqual('2019-04-11');
      expect(milestonePagination.current).toEqual(
        formatDateToMilestone(getNextMilestone()),
      );
    });

    it('gets pagination based on a specific start date that matches the dayOfWeek', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '11');
      const milestonePagination = getMilestonePagination({
        startDate,
        dayOfWeek: 4,
      });
      expect(milestonePagination.prevFromStart).toEqual('2019-04-04');
      expect(milestonePagination.start).toEqual('2019-04-11');
      expect(milestonePagination.nextFromStart).toEqual('2019-04-18');
      expect(milestonePagination.current).toEqual(
        formatDateToMilestone(getNextMilestone()),
      );
    });
  });

  describe('setIssuePriorityProp()', () => {
    it('should set priority property', () => {
      const testIssue = {
        labels: {
          nodes: [
            {
              name: 'priority: p1',
            },
          ],
        },
      };

      setIssuePriorityProp(testIssue);
      expect(testIssue.priority).toEqual('p1');
    });

    it('should priority to null if no priority label is present', () => {
      const testIssue = {
        labels: {
          nodes: [
            {
              name: 'contrib: assigned',
            },
          ],
        },
      };
      setIssuePriorityProp(testIssue);
      expect(testIssue.priority).toBe(null);
    });

    it('should set priority to null if no labels exist', () => {
      const issueWithNoLabels = {};
      setIssuePriorityProp(issueWithNoLabels);
      expect(issueWithNoLabels.priority).toBe(null);
    });
  });

  describe('setIsContribProp()', () => {
    it('should set isContrib if a contributor is assigned', () => {
      const testIssue = {
        labels: {
          nodes: [
            {
              name: 'contrib: assigned',
            },
          ],
        },
      };
      setIsContribProp(testIssue);
      expect(testIssue.isContrib).toBe(true);
    });

    it('should set isContrib to false if contrib label is missing', () => {
      const testIssue = {
        labels: {
          nodes: [
            {
              name: 'priority: p1',
            },
          ],
        },
      };

      setIsContribProp(testIssue);
      expect(testIssue.isContrib).toBe(false);
    });

    it('should set isContrib to false if no labels exist', () => {
      const issueWithNoLabels = {};
      setIsContribProp(issueWithNoLabels);
      expect(issueWithNoLabels.isContrib).toBe(false);
    });
  });

  describe('setAssigneeProp', () => {
    it('should set assignee if provided', () => {
      const testIssue = {
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
      };
      setAssigneeProp(testIssue);
      expect(testIssue.assignee).toEqual('example-username');
    });

    it('should set default if no assignee provided', () => {
      const testIssue = {
        assignees: {
          nodes: [],
        },
      };
      setAssigneeProp(testIssue);
      expect(testIssue.assignee).toEqual('00_unassigned');
    });
  });

  describe('setRepoProp', () => {
    it('should set repo', () => {
      const testIssue = {
        repository: {
          name: 'reponame',
        },
      };
      setRepoProp(testIssue);
      expect(testIssue.repo).toEqual('reponame');
    });
  });

  describe('setProjectProps', () => {
    it('should set project props', () => {
      const testIssue = {
        projectCards: {
          nodes: [
            {
              project: {
                name: 'Project Name',
                url: 'https://example.com/example-project-1',
              },
            },
          ],
        },
      };
      setProjectProps(testIssue);
      expect(testIssue.hasProject).toBe(true);
      expect(testIssue.projectName).toEqual('Project Name');
      expect(testIssue.projectUrl).toEqual(
        'https://example.com/example-project-1',
      );
    });

    it('should set hasProject to false if no project data exists', () => {
      const testIssue = {};
      setProjectProps(testIssue);
      expect(testIssue.hasProject).toBe(false);
    });
  });

  describe('setReviewerDetails', () => {
    let testIssue;

    beforeEach(() => {
      testIssue = {
        number: 2,
        state: 'CLOSED',
        assignees: {
          nodes: [
            {
              id: '367468234',
              name: 'User Name',
              login: 'example-user-1',
              avatarUrl: 'https://example.com/avatar/id/367468234',
            },
          ],
        },
        timelineItems: {
          edges: [
            {
              event: {
                source: {
                  bodyText: 'fixes #2 blah blah',
                  permalink: 'https://example.com/pull/12086',
                  reviews: {
                    totalCount: 1,
                    edges: [
                      {
                        review: {
                          author: {
                            login: 'example-user-2',
                            avatarUrl: 'https://example.com/avatar/id/47234',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      };
    });

    it('should set a reviewer', () => {
      setReviewerDetails(testIssue);
      expect(testIssue.reviewers[0].author.login).toEqual('example-user-2');
      expect(testIssue.reviewers[1]).toBe(undefined);
    });

    it('should set multiple reviewers', () => {
      testIssue.timelineItems.edges[0].event.source.reviews.totalCount = 2;
      testIssue.timelineItems.edges[0].event.source.reviews.edges.push({
        review: {
          author: {
            login: 'example-user-3',
            avatarUrl: 'https://example.com/avatar/id/44',
          },
        },
      });
      setReviewerDetails(testIssue);
      expect(testIssue.reviewersNames).toEqual('example-user-2-example-user-3');
    });

    it('should not set a reviewer for an OPEN issue', () => {
      testIssue.state = 'OPEN';
      setReviewerDetails(testIssue);
      expect(testIssue.reviewers.length).toEqual(0);
      expect(testIssue.reviewersNames).toEqual('');
    });

    it('should not set a reviewer when reviews is falsey', () => {
      testIssue.timelineItems.edges[0].event.source.reviews = undefined;
      setReviewerDetails(testIssue);
      expect(testIssue.reviewers.length).toEqual(0);
      expect(testIssue.reviewersNames).toEqual('');
    });
  });

  describe('setStateLabels()', () => {
    it('should set a default stateLabel for closed issue', () => {
      const testIssue = {
        state: 'CLOSED',
        labels: {
          nodes: [
            {
              name: 'priority: p1',
            },
          ],
        },
      };
      setStateLabels(testIssue);
      expect(testIssue.stateLabel).toBe('closed');
      expect(testIssue.stateLabelColor).toBe(colors.closed);
    });

    it('should set a default stateLabel for open issue', () => {
      const testIssue = {
        state: 'OPEN',
        labels: {
          nodes: [
            {
              name: 'priority: p1',
            },
          ],
        },
      };
      setStateLabels(testIssue);
      expect(testIssue.stateLabel).toBe('open');
      expect(testIssue.stateLabelColor).toBe(colors.open);
    });

    it('should set stateLabel for pr ready', () => {
      const testIssue = {
        state: 'OPEN',
        labels: {
          nodes: [
            {
              name: 'state: pull request ready',
            },
          ],
        },
      };
      setStateLabels(testIssue);
      expect(testIssue.stateLabel).toBe('PR ready');
      expect(testIssue.stateLabelColor).toBe(colors.prReady);
    });

    it('should set stateLabel for verified fixed', () => {
      const testIssue = {
        state: 'CLOSED',
        labels: {
          nodes: [
            {
              name: 'state: verified fixed',
            },
          ],
        },
      };
      setStateLabels(testIssue);
      expect(testIssue.stateLabel).toBe('verified fixed');
      expect(testIssue.stateLabelColor).toBe(colors.verified);
    });

    it('should set stateLabel for in progress', () => {
      const testIssue = {
        state: 'OPEN',
        labels: {
          nodes: [
            {
              name: 'state: in progress',
            },
          ],
        },
      };
      setStateLabels(testIssue);
      expect(testIssue.stateLabel).toBe('in progress');
      expect(testIssue.stateLabelColor).toBe(colors.inProgress);
    });

    it('should set stateLabel for qa not needed', () => {
      const testIssue = {
        state: 'CLOSED',
        labels: {
          nodes: [
            {
              name: 'qa: not needed',
            },
          ],
        },
      };
      setStateLabels(testIssue);
      expect(testIssue.stateLabel).toBe('closed QA-');
      expect(testIssue.stateLabelColor).toBe(colors.verified);
    });
  });

  describe('formatIssueData()', () => {
    const testIssues = {
      data: {
        milestone_issues: {
          results: [
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
                projectCards: {
                  nodes: [
                    {
                      project: {
                        name: 'Project Name',
                        url: 'https://example.com/example-project-1',
                      },
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
                projectCards: {
                  nodes: [],
                },
                timelineItems: {
                  edges: [
                    {
                      event: {
                        source: {
                          bodyText: 'fixes #2',
                          permalink: 'https://example.com/pull/12086',
                          reviews: {
                            totalCount: 1,
                            edges: [
                              {
                                review: {
                                  author: {
                                    login: 'example-user-2',
                                    avatarUrl:
                                      'https://example.com/avatar/id/47234',
                                  },
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    };

    it('adds priority prop to issues with priority labels', () => {
      const formattedData = formatIssueData(testIssues);
      expect(formattedData[0].priority).toEqual('p1');
      expect(formattedData[1].priority).toEqual('p2');
    });

    it('adds repo name to issue object', () => {
      const formattedData = formatIssueData(testIssues);
      expect(formattedData[0].repo).toEqual('reponame');
    });
  });
});
