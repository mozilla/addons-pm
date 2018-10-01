import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
  Navbar,
  Container,
} from 'react-bootstrap';

import { Quarter } from  './components/Quarter';
import BreadcrumbNav from './components/BreadcrumbNav';

class Home extends Component {

  render() {

    return (
      <div>
        <Helmet>
          <title>Home Page</title>
        </Helmet>
        <Navbar className="bg-white shadow-sm">
          <BreadcrumbNav props={this.props}/>
        </Navbar>
        <br />
        <Container as="main">
          <h2>Addons Projects</h2>
          <p>Choose a quarter:</p>
          <Quarter year="2018" />
          <Quarter year="2019" />
        </Container>
      </div>
    );
  }
}

export default Home;
