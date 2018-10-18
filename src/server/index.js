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
  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Addons-PM Server listening on ${port}`);
}

if (typeof module !== 'undefined' && !module.parent) {
  startServer();
}

module.exports = {
  getProjects,
  getTeam,
  startServer,
};
