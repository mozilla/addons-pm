import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';
import Octicon, {
  Dashboard,
  Milestone,
  Organization,
  Project,
} from '@githubprimer/octicons-react';

class Home extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Home Page</title>
        </Helmet>
        <br />
        <Container as="main" className="home">
          <Card>
            <Card.Header>Projects</Card.Header>
            <Card.Body>
              <Row>
                <Col md="auto">
                  <Octicon icon={Project} size="large" />
                </Col>
                <Col>
                  <Card.Text as="div">
                    <p>
                      This view shows our current projects, in-progress for the
                      AMO team, plus you can navigate to previous and future
                      quarters.
                    </p>
                    <p>
                      Each project's data is provided by Github's API, and this
                      view is a way to provide an overview of the projects per
                      quarter for just our team.
                    </p>
                    <LinkContainer to="/projects/latest/" exact>
                      <Button
                        href="/projects/latest/"
                        variant="outline-primary"
                      >
                        View Projects
                      </Button>
                    </LinkContainer>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Milestones</Card.Header>
            <Card.Body>
              <Row>
                <Col md="auto">
                  <Octicon icon={Milestone} size="large" />
                </Col>
                <Col>
                  <Card.Text as="div">
                    <p>
                      Milestones are used to provide an overview of what we're
                      shipping each week. You can also navigate to previous and
                      next milestones.
                    </p>
                    <p>
                      Each week we review what we're shipping with the current
                      milestone and preview what's being worked on for the
                      following week as part of our weekly Engineering stand-up.
                    </p>
                    <LinkContainer to="/milestones/latest/" exact>
                      <Button
                        href="/milestones/latest/"
                        variant="outline-primary"
                      >
                        View Milestones
                      </Button>
                    </LinkContainer>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Dashboard</Card.Header>
            <Card.Body>
              <Row>
                <Col md="auto">
                  <Octicon icon={Dashboard} size="large" />
                </Col>
                <Col>
                  <Card.Text as="div">
                    <p>
                      This tool is used to give us an overview of what the issue
                      counts look like and highlights any high priority bugs
                    </p>
                    <LinkContainer to="/dashboard/" exact>
                      <Button href="/dashboard/" variant="outline-primary">
                        View Dashboard
                      </Button>
                    </LinkContainer>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Contributions</Card.Header>
            <Card.Body>
              <Row>
                <Col md="auto">
                  <Octicon icon={Organization} size="large" />
                </Col>
                <Col>
                  <Card.Text as="div">
                    <p>
                      This view shows bugs that might be suitable for a
                      contributor to work on, this data is used as part of the
                      bi-weekly contributor bug review.
                    </p>
                    <LinkContainer
                      to="/contrib/maybe-good-first-bugs/?dir=desc&sort=updatedAt"
                      exact
                    >
                      <Button
                        href="/contrib/maybe-good-first-bugs/?dir=d3esc&sort-updatedAt"
                        variant="outline-primary"
                      >
                        View Contributions
                      </Button>
                    </LinkContainer>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}

export default Home;
