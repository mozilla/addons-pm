import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getMilestones from 'pages/api/gh-milestone-issues';
import milestoneData from 'fixtures/gh-milestone-issues';

describe('gh-milestone-issues API', () => {
  beforeEach(() => {
    fetchMock.once('https://api.github.com/graphql', milestoneData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return a 400 for an invalid milestone', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/milestone-issues/?milestone=2018-13-32',
      query: {
        milestone: '2018-13-32',
      },
    });
    const res = new MockExpressResponse();
    await getMilestones(req, res);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSON()).toEqual({ error: 'Incorrect milestone format' });
  });

  it('should return milestone data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/milestone-issues/?milestone=2019-05-09',
      query: {
        milestone: '2019-05-09',
      },
    });
    const res = new MockExpressResponse();
    await getMilestones(req, res);
    expect(res._getJSON()).toEqual(milestoneData);
  });
});
