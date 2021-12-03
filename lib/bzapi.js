import queryString from 'query-string';

import serverSWR from './serverSWR';

export const baseWEBURL = 'https://bugzilla.mozilla.org/buglist.cgi';
const baseAPIURL = 'https://bugzilla.mozilla.org/rest/bug';

const needsInfoParams = {
  include_fields: 'id',
  f1: 'flagtypes.name',
  f2: 'requestees.login_name',
  o1: 'casesubstring',
  o2: 'equals',
  v1: 'needinfo?',
  v2: null, // Placeholder for the user email.
};

const whiteboardTagParams = {
  status_whiteboard_type: 'allwordssubstr',
  status_whiteboard: null, // Placeholder for the whiteboard tag to look for.
};

const webExtOnlyParams = {
  component: [
    'Add-ons Manager',
    'Android',
    'Compatibility',
    'Developer Outreach',
    'Developer Tools',
    'Experiments',
    'Frontend',
    'General',
    'Request Handling',
    'Storage',
    'Themes',
    'Untriaged',
  ],
  product: ['Toolkit', 'WebExtensions'],
};

const openBugParams = {
  resolution: '---',
  bug_status: ['ASSIGNED', 'NEW', 'REOPENED', 'UNCONFIRMED'],
};

export function fetchIssueCount({ priority, product, bug_severity } = {}) {
  const params = {
    product,
    priority,
    bug_severity,
    count_only: true,
    limit: 0,
  };

  /* istanbul ignore next */
  if (params.bug_priority && params.bug_severity) {
    throw new Error('Query only severity or priority independently');
  }

  if (bug_severity) {
    delete params.priority;
  }

  if (priority) {
    delete params.bug_severity;
  }

  if (product === 'Toolkit') {
    params.component = 'Add-ons Manager';
  }

  const apiURL = `${baseAPIURL}?${queryString.stringify({
    ...params,
    ...openBugParams,
  })}`;
  const webParams = { ...params, ...openBugParams };
  delete webParams.count_only;
  const webURL = `${baseWEBURL}?${queryString.stringify(webParams)}`;
  return serverSWR(
    apiURL,
    async () => {
      const res = await fetch(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      return { count: json.bug_count, url: webURL };
    },
    {
      hashKey: true,
    },
  );
}

export function fetchNeedInfo(email) {
  const apiParams = { ...needsInfoParams, ...webExtOnlyParams };
  apiParams.v2 = email;

  const apiURL = `${baseAPIURL}?${queryString.stringify(apiParams)}`;
  return serverSWR(
    apiURL,
    async () => {
      const result = await fetch(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      });
      return result.json();
    },
    {
      hashKey: true,
    },
  );
}

export function fetchWhiteboardTag(whiteboardTag) {
  const apiParams = {
    ...whiteboardTagParams,
    ...webExtOnlyParams,
    ...openBugParams,
    status_whiteboard: whiteboardTag,
    count_only: true,
  };

  const webParams = { ...apiParams };
  delete webParams.count_only;

  const apiURL = `${baseAPIURL}?${queryString.stringify(apiParams)}`;
  const webURL = `${baseWEBURL}?${queryString.stringify(webParams)}`;

  return serverSWR(
    apiURL,
    async () => {
      const result = await fetch(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await result.json();
      return { count: json.bug_count, url: webURL };
    },
    {
      hashKey: true,
    },
  );
}
