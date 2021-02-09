import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getContribWelcome from 'pages/api/gh-contrib-welcome';
import contribWelcomeData from 'fixtures/gh-contrib-welcome';

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock('https://api.github.com/graphql', contribWelcomeData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return contrib welcome data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-good-first-bugs/',
    });
    const res = new MockExpressResponse();
    await getContribWelcome(req, res);
    expect(res._getJSON()).toEqual(contribWelcomeData);
  });
});
