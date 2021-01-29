import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import {
  MeterIcon,
  MilestoneIcon,
  PeopleIcon,
  ProjectIcon,
} from '@primer/octicons-react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';

export default function Home() {
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
                <ProjectIcon size="large" />
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
                  <Link href="/projects/latest/" exact>
                    <Button href="/projects/latest/" variant="outline-primary">
                      View Projects
                    </Button>
                  </Link>
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
                <MilestoneIcon size="large" />
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
                  <Link href="/milestones/latest/" exact>
                    <Button
                      href="/milestones/latest/"
                      variant="outline-primary"
                    >
                      View Milestones
                    </Button>
                  </Link>
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>Dashboards</Card.Header>
          <Card.Body>
            <Row>
              <Col md="auto">
                <MeterIcon size="large" />
              </Col>
              <Col>
                <Card.Text as="div">
                  <p>
                    These dashboards are used to give us an overview of what the
                    issue counts look like and highlights any high priority
                    bugs.
                  </p>
                  <Link href="/dashboards/amo/" exact>
                    <Button href="/dashboards/amo/" variant="outline-primary">
                      View AMO Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboards/webext/" exact>
                    <Button
                      href="/dashboards/webext/"
                      variant="outline-primary"
                    >
                      View Web-Extensions Dashboard
                    </Button>
                  </Link>
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
                <PeopleIcon size="large" />
              </Col>
              <Col>
                <Card.Text as="div">
                  <p>
                    This view shows bugs that might be suitable for a
                    contributor to work on, this data is used as part of the
                    bi-weekly contributor bug review.
                  </p>
                  <Link href="/contrib/maybe-good-first-bugs/?dir=desc&sort=updatedAt">
                    <Button
                      href="/contrib/maybe-good-first-bugs/?dir=d3esc&sort-updatedAt"
                      variant="outline-primary"
                    >
                      View Contributions
                    </Button>
                  </Link>
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
