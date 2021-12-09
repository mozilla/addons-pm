/*
 * This file provides a fetch that uses node-cache under the covers to replicate SWR on the server.
 * This enables caching to be handled in a specific way for API calls we're carrying
 * out from the server.
 *
 */

const crypto = require('crypto');

const NodeCache = require('node-cache');

const cache = new NodeCache();

// timeToStale is the amount of time that should pass before
// a cached results is considered stale.
// Default: 5 Minutes.
const TIME_TO_STALE_DEFAULT = 5 * 60 * 1000;
// staleMargin is added to the timstamp on stale requests
// to temporarily increase the time it's considered stale. This stops a
// lot of revalidation requests being made.
// Default: 10 Secs
const STALE_MARGIN_DEFAULT = 10 * 1000;

const serverSWR = async (
  key,
  fetcher,
  {
    timeToStale = TIME_TO_STALE_DEFAULT,
    staleMargin = STALE_MARGIN_DEFAULT,
    swrCache = cache,
    hashKey = false,
  } = {},
) => {
  if (hashKey) {
    key = crypto.createHash('sha256').update(key).digest('hex');
  }

  async function fetchAndCache() {
    const result = await fetcher();
    const cacheObject = {
      timestamp: new Date().getTime(),
      response: result,
    };

    swrCache.set(key, cacheObject);
    return result;
  }

  if (swrCache.has(key)) {
    const cachedData = swrCache.get(key);
    if (typeof cachedData !== 'undefined') {
      const currentTime = new Date().getTime();
      if (currentTime > cachedData.timestamp + timeToStale) {
        cachedData.timestamp = new Date().getTime() + staleMargin;
        cachedData.response.stale = true;
        // Re-insert the cache entry to update the timestamp.
        // This prevents lots of revalidation requests.
        swrCache.set(key, cachedData);
        // Refetch async without waiting for the result.
        fetchAndCache();
      }
      return cachedData.response;
    }
  }
  return fetchAndCache();
};

module.exports = serverSWR;
