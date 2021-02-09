import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getProjects from 'pages/api/gh-projects';
import projectData from 'fixtures/gh-projects';

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.once('https://api.github.com/graphql', projectData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return project data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-projects/?year=2018&quarter=Q3',
      query: {
        year: '2018',
        quarter: 'Q3',
      },
    });
    const res = new MockExpressResponse();
    await getProjects(req, res);
    expect(res._getJSON()).toEqual(projectData);
  });

  it('should return a 400 for an invalid year', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-projects/?year=whatever&quarter=Q3',
      query: {
        year: 'whatever',
        quarter: 'Q3',
      },
    });

    const res = new MockExpressResponse();
    await getProjects(req, res);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSON()).toEqual({ error: 'Incorrect year format' });
  });

  it('should return a 400 for an invalid quarter', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/gh-projects/?year=2018&quarter=whatever',
      query: {
        year: '2018',
        quarter: 'whatever',
      },
    });
    const res = new MockExpressResponse();
    await getProjects(req, res);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSON()).toEqual({ error: 'Incorrect quarter format' });
  });
});
