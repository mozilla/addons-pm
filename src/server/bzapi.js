// Magically require any env variables defined in a local .env file.
require('dotenv').config();
// Polyfill fetch.
require('isomorphic-fetch');
const queryString = require('query-string');

const baseAPIURL = 'https://bugzilla.mozilla.org/rest/bug';
const baseWEBURL = 'https://bugzilla.mozilla.org/buglist.cgi';
const needsInfoURL = `${baseAPIURL}?include_fields=id&f1=flagtypes.name&f2=requestees.login_name&o1=casesubstring&o2=equals&v1=needinfo%3F&v2=`;
const webExtOnlyQualifier =
  '&component=Add-ons Manager&component=Android&component=Compatibility&component=Developer Outreach&component=Developer Tools&component=Experiments&component=Frontend&component=General&component=Request Handling&component=Storage&component=Themes&component=Untriaged&product=Toolkit&product=WebExtensions';
const priorities = ['--', 'P1', 'P2', 'P3', 'P4', 'P5'];
const severities = ['normal', '--', 'N/A', 'S1', 'S2', 'S3', 'S4'];
const products = ['Toolkit', 'WebExtensions', 'Firefox'];

const defaultParams = {
  count_only: true,
  resolution: '---',
  bug_status: ['UNCONFIRMED', 'NEW', 'ASSIGNED', 'REOPENED'],
  limit: 0,
};

function fetchIssueCount({ priority, product, bug_severity } = {}) {
  const params = { ...defaultParams, product, priority, bug_severity };
  if (params.bug_priority && params.bug_severity) {
    throw new Error('Query only severity or priority independently');
  }

  if (bug_severity) {
    delete params.priority;
  }
  if (priority) {
    delete params.bug_severity;
  }
  // console.log(JSON.stringify(params));

  if (product === 'Toolkit') {
    params.component = 'Add-ons Manager';
  } else if (product === 'Firefox') {
    params.component = 'Extension Compatibility';
  }
  const apiURL = `${baseAPIURL}?${queryString.stringify(params)}`;
  const webParams = { ...params };
  delete webParams.count_only;
  const webURL = `${baseWEBURL}?${queryString.stringify(webParams)}`;
  return fetch(apiURL, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((json) => {
      return { count: json.bug_count, url: webURL };
    });
}

function getBugzillaIssueCounts() {
  const requests = [];
  const combinedData = {};

  for (const product of products) {
    combinedData[product] = {};

    for (const priority of priorities) {
      requests.push(
        fetchIssueCount({
          product,
          priority,
          bug_severity: null,
        }).then((result) => {
          let priorityLabel;
          switch (priority) {
            case '--':
              priorityLabel = 'default';
              break;
            default:
              priorityLabel = priority.toLowerCase();
          }
          combinedData[product][`priority-${priorityLabel}`] = result;
        }),
      );
    }

    for (const bug_severity of severities) {
      requests.push(
        fetchIssueCount({
          product,
          bug_severity,
          priority: null,
        }).then((result) => {
          let severityLabel;
          switch (bug_severity) {
            case 'N/A':
              severityLabel = 'not-applicable';
              break;
            case '--':
              severityLabel = 'default';
              break;
            default:
              severityLabel = bug_severity.toLowerCase();
          }
          combinedData[product][`severity-${severityLabel}`] = result;
        }),
      );
    }

    requests.push(
      fetchIssueCount({
        product,
        bug_severity: null,
        priority: null,
      }).then((result) => {
        combinedData[product][`total`] = result;
      }),
    );
  }

  return Promise.all(requests).then(() => {
    return combinedData;
  });
}

function fetchNeedInfo(email, nick) {
  const encodedEmail = encodeURIComponent(email);
  let apiURL = `${needsInfoURL}${encodedEmail}`;
  if (nick === 'UX') {
    // Limit UX need-infos to web-ext components and products.
    apiURL = `${apiURL}${webExtOnlyQualifier}`;
  }
  return fetch(apiURL, {
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
}

function getBugzillaNeedInfos() {
  const requests = [];
  const combinedData = {};
  const BZ_USERS = JSON.parse(process.env.BZ_USERS) || {};

  for (const nick in BZ_USERS) {
    combinedData[nick] = {};
    requests.push(
      fetchNeedInfo(BZ_USERS[nick], nick).then((result) => {
        combinedData[nick].count = result.bugs.length;
        if (result.bugs.length) {
          combinedData[nick].url = `${baseWEBURL}?bug_id=${result.bugs
            .map((item) => item.id)
            .join(',')}`;
        }
      }),
    );
  }

  return Promise.all(requests).then(() => {
    return combinedData;
  });
}

module.exports = {
  getBugzillaIssueCounts,
  getBugzillaNeedInfos,
};
