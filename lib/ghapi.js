import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import hash from 'object-hash';

import introspectionQueryResultData from './fragmentTypes.json';
import serverSWR from './serverSWR';

export default function createClient() {
  const headers = {};
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    if (process.env.GH_TOKEN) {
      headers.Authorization = `token ${process.env.GH_TOKEN}`;
    } else {
      throw new Error('No GH_TOKEN found');
    }
  }

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  // For fetches to work correctly we use a new client instance for
  // each request to avoid stale data.
  const gqlClient = new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.github.com/graphql',
      headers,
    }),
    cache: new InMemoryCache({
      fragmentMatcher,
    }),
  });

  // Client with serverSWR wrapper to carry out in memory caching of the original API response
  // from githubs GraphQL API.
  const client = {
    query: async ({ query, variables }) => {
      // Create a hash based on the query with variables.
      const keyHash = hash(
        { queryAsString: query.loc.source.body.toString(), variables },
        { algorithm: 'sha256' },
      );
      return serverSWR(keyHash, async () => {
        const result = await gqlClient.query({ query, variables });
        return result;
      });
    },
  };

  return client;
}
