import {
  GH_API_ROOT,
  validQuarterRX,
  validYearRX,
  validMilestoneRX,
} from '../const';

async function getProjects(year, quarter) {
  if (!validYearRX.test(year)) {
    throw new Error('Invalid Year');
  }

  if (!validQuarterRX.test(quarter)) {
    throw new Error('Invalid Quarter');
  }

  const response = await fetch(
    `${GH_API_ROOT}/projects/?year=${year}&quarter=${quarter}`,
    {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    },
  );
  checkStatus(response);
  return parseJSON(response);
}

async function getMilestoneIssues(milestone) {
  if (!validMilestoneRX.test(milestone)) {
    throw new Error('Invalid Milestone');
  }

  const response = await fetch(
    `${GH_API_ROOT}/milestone-issues/?milestone=${milestone}`,
    {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    },
  );
  checkStatus(response);
  return parseJSON(response);
}

async function getTeam() {
  const response = await fetch(`${GH_API_ROOT}/team/`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  checkStatus(response);
  return parseJSON(response);
}

async function getIssueCounts() {
  const response = await fetch(`${GH_API_ROOT}/issue-counts/`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  checkStatus(response);
  return parseJSON(response);
}

async function getGoodFirstBugs() {
  const response = await fetch(`${GH_API_ROOT}/good-first-bugs/`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  checkStatus(response);
  return parseJSON(response);
}

async function getContribWelcome() {
  const response = await fetch(`${GH_API_ROOT}/contrib-welcome/`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  checkStatus(response);
  return parseJSON(response);
}

async function getMaybeGoodFirstBugs() {
  const response = await fetch(`${GH_API_ROOT}/maybe-good-first-bugs/`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  checkStatus(response);
  return parseJSON(response);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = {
  checkStatus,
  getProjects,
  getTeam,
  getIssueCounts,
  getContribWelcome,
  getGoodFirstBugs,
  getMaybeGoodFirstBugs,
  getMilestoneIssues,
};
export default Client;
