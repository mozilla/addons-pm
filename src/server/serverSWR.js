/*
 * This file provides a fetch that uses swr's cache under the covers.
 * This enables caching to be handles a specific way.
 *
 */

const { cache } = require('swr');

const serverSWR = async (url, fetcher) => {
  async function fetchAndCache() {
    const result = await fetcher();
    const cacheObject = {
      timestamp: new Date().getTime(),
      response: result,
    }
    cache.set(url, cacheObject);
    return result;
  }

  if (cache.has(url)) {
    const cachedData = cache.get(url);
    const currentTime = new Date().getTime();
    if (currentTime > (cachedData.timestamp + 5 * 1000)) {
      cachedData.response.stale = true;
      fetchAndCache();
    }
    return cachedData.response;
  } else {
    return fetchAndCache();
  }
}


module.exports = serverSWR;
