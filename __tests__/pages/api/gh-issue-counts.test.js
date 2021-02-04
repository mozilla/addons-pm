import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getIssueCounts from 'pages/api/gh-issue-counts';
import issueCountData from 'fixtures/gh-issue-counts';

describe('gh-issue-counts API', () => {
  beforeEach(() => {
    fetchMock.mock('https://api.github.com/graphql', issueCountData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return issue count data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-issue-counts/',
    });
    const res = new MockExpressResponse();
    await getIssueCounts(req, res);
    expect(res._getJSON()).toEqual(issueCountData);
  });
});
