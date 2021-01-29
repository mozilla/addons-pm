import serverSWR from './serverSWR';

describe('serverSWR', () => {
  let fakeCache;
  let fakeFetcher;

  beforeEach(() => {
    fakeFetcher = jest.fn();
    fakeCache = {
      has: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    };
  });

  it('should return fresh data', async () => {
    fakeCache.has.mockReturnValueOnce(true);
    fakeCache.get.mockReturnValueOnce({
      response: { test: 'foo-data' },
      timestamp: new Date().getTime() - 5000,
    });
    const result = await serverSWR('foo', fakeFetcher, { swrCache: fakeCache });
    // calls[0][0] first call and first arg.
    expect(fakeCache.has.mock.calls[0][0]).toBe('foo');
    expect(fakeCache.get.mock.calls[0][0]).toBe('foo');
    // Based on the time being older than now, the fetcher shouldn't be called.
    expect(fakeFetcher.mock.calls.length).toBe(0);
    // Based on the time being older than now, there should be nothing new to cache.
    expect(fakeCache.set.mock.calls.length).toBe(0);
    expect(result.test).toBe('foo-data');
  });

  it('should return stale data first, followed by fresh data', async () => {
    fakeCache.has.mockReturnValue(true);
    fakeCache.get
      .mockReturnValueOnce({
        response: { test: 'foo-data' },
        // Older than 5 minutes in the past in milliseconds.
        timestamp: new Date().getTime() - (5 * 60 * 1000 + 5),
      })
      .mockReturnValueOnce({
        response: { test: 'new-foo-data' },
        timestamp: new Date().getTime() - 5000,
      });
    const result = await serverSWR('foo', fakeFetcher, { swrCache: fakeCache });
    // calls[0][0] first call and first arg.
    expect(fakeCache.has.mock.calls[0][0]).toBe('foo');
    expect(fakeCache.get.mock.calls[0][0]).toBe('foo');
    // Based on the time being newer than cached data the fetcher should be called.
    expect(fakeFetcher.mock.calls.length).toBe(1);
    // Based on the time being newer than now, the cache should be updated with a new
    // timestamp to prevent premature re-fetches as well as providing the new data.
    expect(fakeCache.set.mock.calls.length).toBe(2);
    // Data should be stale the first time.
    expect(result.test).toBe('foo-data');
    const newResult = await serverSWR('foo', fakeFetcher, {
      swrCache: fakeCache,
    });
    // On the second call it should be fresh.
    expect(newResult.test).toBe('new-foo-data');
  });
});
