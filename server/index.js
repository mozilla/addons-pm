const express = require('express');
const path = require('path');
const app = express();

const ghapi = require('./ghapi');


app.get('/api/projects/', async (req, res) => {
  const { year, quarter } = req.query;
  const projects = await ghapi.getProjects({ projectSearch: `Add-ons ${quarter} ${year}` });
  res.json(projects);
});

app.get('/api/team/', async (req, res) => {
  const team = await ghapi.getTeam();
  res.json(team);
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Addons-PM Server listening on ${port}`);
