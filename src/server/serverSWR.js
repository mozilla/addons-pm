/*
 * This file provides a fetch that uses swr's cache under the covers.
 * This enables caching to be handled in a specific way for API calls we're carrying out from the server.
 *
 */

const { cache } = require('swr');

// timeToStale is the amount of time that should pass before
// a cached results is considered stale.
// Default: 5 Minutes.
const TIME_TO_STALE_DEFAULT = 5 * 60 * 1000;
// staleMargin is added to the timstamp on stale requests
// to temporarily increase the time it's considered stale. This stops a
// lot of revalidation requests being made.
// Default: 10 Secs
const STALE_MARGIN_DEFAULT = 10 * 1000;

const serverSWR = async (key, fetcher, { timeToStale=TIME_TO_STALE_DEFAULT, staleMargin=STALE_MARGIN_DEFAULT, swrCache=cache } = {}) => {
  async function fetchAndCache() {
    const result = await fetcher();
    const cacheObject = {
      timestamp: new Date().getTime(),
      response: result,
    }
    swrCache.set(key, cacheObject);
    return result;
  }

  if (cache.has(key)) {
    const cachedData = swrCache.get(key);
    const currentTime = new Date().getTime();
    if (currentTime > (cachedData.timestamp + timeToStale)) {
      cachedData.timestamp = new Date().getTime() + staleMargin;
      cachedData.response.stale = true;
      // Re-insert the cache entry to update the timestamp.
      // This prevents lots of revalidation requests.
      swrCache.set(key, cachedData);
      // Refetch async without waiting for the result.
      fetchAndCache();
    }
    return cachedData.response;
  } else {
    return fetchAndCache();
  }
}


module.exports = serverSWR;
