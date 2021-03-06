import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getBZIssueCounts from 'pages/api/bz-issue-counts';
import bzIssueCountSingleData from 'tests/fixtures/bz-issue-count-single';
import bzIssueCountsData from 'tests/fixtures/bz-issue-counts';

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(
      'begin:https://bugzilla.mozilla.org/rest/bug',
      bzIssueCountSingleData,
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return bugzilla issue count data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/bugzilla-issue-counts/',
    });
    const res = new MockExpressResponse();
    await getBZIssueCounts(req, res);
    expect(res._getJSON()).toEqual(bzIssueCountsData);
  });
});
