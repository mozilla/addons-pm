const express = require('express');
const app = express();

const ghapi = require('./ghapi');


const getProjects = async (req, res) => {
  const { year, quarter } = req.query;
  const projects = await ghapi.getProjects({ projectSearch: `Add-ons ${quarter} ${year}` });
  res.json(projects);
}

const getTeam = async (req, res) => {
  const team = await ghapi.getTeam();
  res.json(team);
}

app.get('/api/projects/', getProjects);
app.get('/api/team/', getTeam);


function startServer() {
  let portOrSocket = process.env.PORT || 5000;
  if (process.env.NODE_ENV === 'production') {
    portOrSocket = '/tmp/nginx.socket';
  }
  app.listen(portOrSocket);
  console.log(`Addons-PM Server listening on ${portOrSocket}`);
}

if (typeof module !== 'undefined' && !module.parent) {
  startServer();
}

module.exports = {
  getProjects,
  getTeam,
  startServer,
};
