const fs = require('fs');
const express = require('express');
const app = express();

const ghapi = require('./ghapi');

const constants = require('../const');


const getProjects = async (req, res, next) => {
  const { year, quarter } = req.query;
  if (!constants.validYearRX.test(year)) {
    res.status(400).json({ error: 'Incorrect year format' });
  } else if (!constants.validQuarterRX.test(quarter)) {
    res.status(400).json({ error: 'Incorrect quarter format' });
  } else {
    const projects = await ghapi.getProjects({
      projectSearch: `Add-ons ${quarter} ${year}`,
    });
    res.json(projects);
  }
};

const getMilestoneIssues = async (req, res) => {
  const { milestone } = req.query;
  if (!constants.validMilestoneRX.test(milestone)) {
    res.status(400).json({ error: 'Incorrect milestone format' });
  } else {
    const query = `repo:mozilla/addons
      repo:mozilla/addons-server
      repo:mozilla/addons-frontend
      repo:mozilla/addons-linter
      repo:mozilla/addons-code-manager
      milestone:${milestone}
      type:issues`;
    const milestoneIssues = await ghapi.getMilestoneIssues({
      query: query,
    });
    res.json(milestoneIssues);
  }
};

const getTeam = async (req, res) => {
  const team = await ghapi.getTeam();
  res.json(team);
};

const getIssueCounts = async (req, res) => {
  const issueCounts = await ghapi.getIssueCounts();
  res.json(issueCounts);
};

const getGoodFirstBugs = async (req, res) => {
  const goodFirstBugs = await ghapi.getGoodFirstBugs();
  res.json(goodFirstBugs);
};

const getMaybeGoodFirstBugs = async (req, res) => {
  const maybeGoodFirstBugs = await ghapi.getMaybeGoodFirstBugs();
  res.json(maybeGoodFirstBugs);
};

app.get('/api/projects/', getProjects);
app.get('/api/team/', getTeam);
app.get('/api/issue-counts/', getIssueCounts);
app.get('/api/good-first-bugs/', getGoodFirstBugs);
app.get('/api/maybe-good-first-bugs/', getMaybeGoodFirstBugs);
app.get('/api/milestone-issues/', getMilestoneIssues);

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
  getMilestoneIssues,
  startServer,
};
