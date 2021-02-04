import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getGoodFirstBugs from 'pages/api/gh-good-first-bugs';
import goodFirstBugsData from 'fixtures/gh-good-first-bugs';

describe('gh-good-first-bugs API', () => {
  beforeEach(() => {
    fetchMock.mock('https://api.github.com/graphql', goodFirstBugsData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return good first bug data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-good-first-bugs/',
    });
    const res = new MockExpressResponse();
    await getGoodFirstBugs(req, res);
    expect(res._getJSON()).toEqual(goodFirstBugsData);
  });
});
