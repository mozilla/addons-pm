import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getMaybeGoodFirstBugs from 'pages/api/gh-maybe-good-first-bugs';
import maybeGoodFirstBugsData from 'fixtures/gh-maybe-good-first-bugs';

describe('gh-maybe-good-first-bugs API', () => {
  beforeEach(() => {
    fetchMock.mock('https://api.github.com/graphql', maybeGoodFirstBugsData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return maybe good first bug data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-maybe-good-first-bugs/',
    });
    const res = new MockExpressResponse();
    await getMaybeGoodFirstBugs(req, res);
    expect(res._getJSON()).toEqual(maybeGoodFirstBugsData);
  });
});
