import fetchMock from 'fetch-mock';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import getWhiteboardTags from 'pages/api/bz-whiteboard-tags';
import bzWhiteobardTagsSingleData from 'fixtures/bz-whiteboard-tags-single';
import bzWhiteboardTagsData from 'fixtures/bz-whiteboard-tags';

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(
      'begin:https://bugzilla.mozilla.org/rest/bug',
      bzWhiteobardTagsSingleData,
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should return bugzilla whiteboard tag data', async () => {
    const req = new MockExpressRequest({
      method: 'GET',
      url: '/api/bugzilla-issue-counts/',
    });
    const res = new MockExpressResponse();
    await getWhiteboardTags(req, res);
    expect(res._getJSON()).toEqual(bzWhiteboardTagsData);
  });
});
