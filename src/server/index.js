const fs = require('fs');
const express = require('express');
const app = express();

const ghapi = require('./ghapi');

const getProjects = async (req, res) => {
  const { year, quarter } = req.query;
  const projects = await ghapi.getProjects({
    projectSearch: `Add-ons ${quarter} ${year}`,
  });
  res.json(projects);
};

const getTeam = async (req, res) => {
  const team = await ghapi.getTeam();
  res.json(team);
};

const getIssueCounts = async (req, res) => {
  const issueCounts = await ghapi.getIssueCounts();
  res.json(issueCounts);
};

app.get('/api/projects/', getProjects);
app.get('/api/team/', getTeam);
app.get('/api/issue-counts/', getIssueCounts);

function startServer() {
  let portOrSocket = process.env.PORT || 5000;
  if (process.env.NODE_ENV === 'production') {
    portOrSocket = '/tmp/nginx.socket';
  }

  app.listen(portOrSocket);

  if (process.env.DYNO) {
    console.log('This is on Heroku..!!');
    fs.openSync('/tmp/app-initialized', 'w');
  }
  console.log(`Addons-PM Server listening on ${portOrSocket}`);
}

if (typeof module !== 'undefined' && !module.parent) {
  startServer();
}

module.exports = {
  getProjects,
  getTeam,
  getIssueCounts,
  startServer,
};
