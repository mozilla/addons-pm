import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getTeam from 'pages/api/gh-team';
import teamData from 'fixtures/gh-team';

describe('gh-team API', () => {
  beforeEach(() => {
    fetchMock.mock('https://api.github.com/graphql', teamData);
  });

  afterEach(() => {
    fetchMock.restore();
    fetchMock.reset();
  });

  it('should return team data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-team/',
    });
    const res = new MockExpressResponse();
    await getTeam(req, res);
    expect(res._getJSON()).toEqual(teamData);
  });
});
