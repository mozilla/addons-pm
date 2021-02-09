import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getBZNeedInfos from 'pages/api/bz-need-infos';
import bzNeedsInfoSingleData from 'fixtures/bz-need-infos-single';
import bzNeedsInfoData from 'fixtures/bz-need-infos';

describe(__filename, () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    fetchMock.mock(
      'begin:https://bugzilla.mozilla.org/rest/bug',
      bzNeedsInfoSingleData,
    );
  });

  afterEach(() => {
    process.env = OLD_ENV;
    fetchMock.restore();
  });

  it('should return bugzilla need info data', async () => {
    process.env.BZ_USERS = JSON.stringify({
      testuser: 'testuser@example.com',
      testuser2: 'testuser2@example.com',
    });
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/bugzilla-issue-counts/',
    });
    const res = new MockExpressResponse();
    await getBZNeedInfos(req, res);
    expect(res._getJSON()).toEqual(bzNeedsInfoData);
  });
});
