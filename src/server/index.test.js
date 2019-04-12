/* global testData */

import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';

import {
  getProjects,
  getTeam,
  getIssueCounts,
  getMilestoneIssues,
} from './index';
import ghapi from './ghapi';
import sinon from 'sinon';

describe('API Server', () => {
  beforeEach(() => {
    //  Mock API data methods
    const stubGetProjects = sinon.stub(ghapi, 'getProjects');
    stubGetProjects.returns(testData.projects);
    const stubGetTeam = sinon.stub(ghapi, 'getTeam');
    stubGetTeam.returns(testData.team);
    const stubGetIssueCounts = sinon.stub(ghapi, 'getIssueCounts');
    stubGetIssueCounts.returns(testData.issueCounts);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return project data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/projects/?year=2018&quarter=Q3',
      query: {
        year: '2018',
        quarter: 'Q3',
      },
    });
    const res = new MockExpressResponse();
    await getProjects(req, res);
    expect(res._getJSON()).toEqual(testData.projects);
  });

  it('should return a 400 for an invalid year', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/projects/?year=whatever&quarter=Q3',
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
      url: '/api/projects/?year=2018&quarter=whatever',
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

  it('should return a 400 for an invalid milestone', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/milestone-issues/?milestone=2018.13.32',
      query: {
        milestone: '2018.13.32',
      },
    });
    const res = new MockExpressResponse();
    await getMilestoneIssues(req, res);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSON()).toEqual({ error: 'Incorrect milestone format' });
  });

  it('should return team data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/team/',
    });
    const res = new MockExpressResponse();
    await getTeam(req, res);
    expect(res._getJSON()).toEqual(testData.team);
  });

  it('should return issue count data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/issue-counts/',
    });
    const res = new MockExpressResponse();
    await getIssueCounts(req, res);
    expect(res._getJSON()).toEqual(testData.issueCounts);
  });
});
