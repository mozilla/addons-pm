import React from 'react';
import './App.scss';

import { Nav, Navbar } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Octicon, { MarkGithub } from '@githubprimer/octicons-react';

import Home from './Home';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Contrib from './Contrib';
import Milestones from './Milestones';
import NotFound from './NotFound';

import { validProjectTeamMembers, validYears } from '../const';

const App = () => {
  return (
    <Router>
      <div>
        <Helmet defaultTitle="Add-ons PM" titleTemplate="%s - Add-ons PM" />
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Addons PM</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Item>
              <IndexLinkContainer to="/">
                <Nav.Link eventKey={1}>Projects</Nav.Link>
              </IndexLinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/milestones/latest/?dir=asc&sort=assignee"
                isActive={(match, location) => {
                  return location.pathname.indexOf('/milestones') > -1;
                }}
              >
                <Nav.Link eventKey={2}>Milestones</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/dashboard/">
                <Nav.Link eventKey={3}>Dashboard</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/contrib/maybe-good-first-bugs/?dir=desc&sort=updatedAt"
                isActive={(match, location) => {
                  return location.pathname.indexOf('/contrib') > -1;
                }}
              >
                <Nav.Link eventKey={4}>Contributions</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
          <Nav className="mr-sm-2">
            <Nav.Item>
              <Nav.Link
                data-ref="src"
                eventKey="src"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/mozilla/addons-pm/"
              >
                <Octicon
                  icon={MarkGithub}
                  verticalAlign="middle"
                  ariaLabel="View on Github"
                  size="medium"
                />
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path={`/milestones/:year(${validYears.join(
              '|',
            )}).:month(0[1-9]|1[0-2]).:day(0[1-9]|[1-2]\\d|3[0-1])/`}
            component={Milestones}
          />
          <Route
            exact
            path="/milestones/:milestone(latest)/"
            component={Milestones}
          />
          <Route exact path="/dashboard/" component={Dashboard} />
          <Route
            exact
            path="/contrib/:type(good-first-bugs|maybe-good-first-bugs)/"
            component={Contrib}
          />
          <Route
            exact
            path={`/:year(${validYears.join('|')})/`}
            component={Home}
          />
          <Route
            exact
            path={`/:year(${validYears.join('|')})/:quarter(Q[1-4])/`}
            component={Projects}
          />
          <Route
            exact
            path={`/:year(${validYears.join(
              '|',
            )})/:quarter(Q[1-4])/:projectType(primary|secondary)/`}
            component={Projects}
          />
          <Route
            exact
            path={`/:year(${validYears.join(
              '|',
            )})/:quarter(Q[1-4])/:engineer(${validProjectTeamMembers.join(
              '|',
            )})/`}
            component={Projects}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
