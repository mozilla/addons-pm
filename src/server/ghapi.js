// Magically require any env variables defined in a local .env file.
require('dotenv').config();
// Polyfill fetch.
require('isomorphic-fetch');
const ApolloClient = require('apollo-client').ApolloClient;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const IntrospectionFragmentMatcher = require('apollo-cache-inmemory')
  .IntrospectionFragmentMatcher;
const getProjectsQuery = require('./queries/getProjects').projects;
const getTeamQuery = require('./queries/getTeam').team;
const getIssueCountQuery = require('./queries/getIssueCounts').issueCounts;
const getGoodFirstBugsQuery = require('./queries/getGoodFirstBugs')
  .goodFirstBugs;
const getMaybeGoodFirstBugsQuery = require('./queries/getMaybeGoodFirstBugs')
  .maybeGoodFirstBugs;
const getMilestoneIssuesQuery = require('./queries/getMilestoneIssues')
  .milestoneIssues;

const introspectionQueryResultData = require('./fragmentTypes.json');

function createClient() {
  const headers = {};
  if (process.env.GH_TOKEN) {
    headers.Authorization = `token ${process.env.GH_TOKEN}`;
  } else {
    throw new Error('No GH_TOKEN found');
  }

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  // For fetches to work correctly we use a new client instance for
  // each request to avoid stale data.
  const client = new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.github.com/graphql',
      headers,
    }),
    cache: new InMemoryCache({ fragmentMatcher }),
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

async function getMilestoneIssues(variables) {
  const client = createClient();
  const data = await client.query({
    query: getMilestoneIssuesQuery,
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

async function getIssueCounts() {
  const client = createClient();
  const data = await client.query({
    query: getIssueCountQuery,
  });
  return data;
}

async function getGoodFirstBugs() {
  const client = createClient();
  const data = await client.query({
    query: getGoodFirstBugsQuery,
  });
  return data;
}

async function getMaybeGoodFirstBugs() {
  const client = createClient();
  const data = await client.query({
    query: getMaybeGoodFirstBugsQuery,
  });
  return data;
}

module.exports = {
  getProjects,
  getTeam,
  getIssueCounts,
  getGoodFirstBugs,
  getMaybeGoodFirstBugs,
  getMilestoneIssues,
};
