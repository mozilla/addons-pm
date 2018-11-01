/* global testData */

import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';

import { getProjects, getTeam } from './index';
import ghapi from './ghapi';
import sinon from 'sinon';

describe('API Server', () => {

  beforeEach(() => {
    //  Mock API data methods
    const stubGetProjects = sinon.stub(ghapi, 'getProjects');
    stubGetProjects.returns(testData.projects);
    const stubGetTeam = sinon.stub(ghapi, 'getTeam');
    stubGetTeam.returns(testData.team);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return project data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/projects/?year=2018&quarter=Q3'
    });
    const res = new MockExpressResponse();
    await getProjects(req, res);
    expect(res._getJSON()).toEqual(testData.projects);
  });

  it('should return team data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/team/'
    });
    const res = new MockExpressResponse();
    await getTeam(req, res);
    expect(res._getJSON()).toEqual(testData.team);
  });
});
