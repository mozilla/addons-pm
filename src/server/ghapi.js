// Magically require any env variables defined in a local .env file.
require('dotenv').config();
// Polyfill fetch.
require('isomorphic-fetch');
const ApolloClient = require('apollo-client').ApolloClient;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const getProjectsQuery = require('./queries/getProjects').projects;
const getTeamQuery = require('./queries/getTeam').team;

function createClient() {
  const headers = {};
  if (process.env.GH_TOKEN) {
    headers.Authorization = `token ${process.env.GH_TOKEN}`;
  } else {
    throw new Error('No GH_TOKEN found');
  }

  // For fetches to work correctly we use a new client instance for
  // each request to avoid stale data.
  const client = new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.github.com/graphql',
      headers,
    }),
    cache: new InMemoryCache(),
  });
  return client;
}

async function getProjects(variables) {
  const client = createClient();
  const data = await client.query({
    query: getProjectsQuery,
    variables,
  });
  return data;
}

async function getTeam() {
  const client = createClient();
  const data = await client.query({
    query: getTeamQuery,
  });
  return data;
}

module.exports = {
  getProjects,
  getTeam,
};
