import React from 'react';
import './App.css';

import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Octicon, { Project } from '@githubprimer/octicons-react';

import Home from './Home';
import Projects from './Projects';
import NotFound from './NotFound';

const App = () => {
  return (
    <Router>
      <div>
        <Helmet defaultTitle="Add-ons PM" titleTemplate="%s - Add-ons PM" />
        <Navbar bg="dark" variant="dark">
          <LinkContainer to="/">
            <Navbar.Brand>
              <Octicon icon={Project} verticalAlign="middle" /> Addons PM
            </Navbar.Brand>
          </LinkContainer>
          <Nav>
            <Nav.Item>
              <Nav.Link
                data-ref="src"
                eventKey={1}
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/mozilla/addons-pm/"
              >
                Source Code
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/:year(\d{4})/:quarter(Q[1-4]{1})/"
            component={Projects}
          />
          <Route
            exact
            path="/:year(\d{4})/:quarter(Q[1-4]{1})/:projectType(primary|secondary)/"
            component={Projects}
          />
          <Route
            exact
            path="/:year(\d{4})/:quarter(Q[1-4]{1})/:engineer(\w+)/"
            component={Projects}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
