import { GH_API_ROOT, validQuarterRX, validYearRX } from './const';

async function getProjects(year, quarter) {
  if (!validYearRX.test(year)) {
    throw new Error('Invalid Year');
  }

  if (!validQuarterRX.test(quarter)) {
    throw new Error('Invalid Quarter');
  }

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`${GH_API_ROOT}/projects/?year=${year}&quarter=${quarter}`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  });
  checkStatus(response);
  return parseJSON(response);
}

async function getTeam() {
  const response = await fetch(`${GH_API_ROOT}/team/`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    })
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
  return response.json()
}

const Client = { checkStatus, getProjects, getTeam };
export default Client;
