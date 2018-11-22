import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { sanitize } from './utils';
import {
  Button,
  Card,
  CardDeck,
  Container,
  Image,
  Nav,
  Navbar,
  Row,
  ProgressBar,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Octicon, { Clock, Project } from '@githubprimer/octicons-react';

import Client from './Client';
import BreadcrumbNav from './components/BreadcrumbNav';

class Projects extends Component {
  state = {
    projects: {
      data: null,
    },
    team: {
      data: null,
    },
  };

  async getProjects(year, quarter) {
    return await Client.getProjects(year, quarter);
  }

  async getTeam() {
    return await Client.getTeam();
  }

  async componentDidMount() {
    const { match } = this.props;
    const { year, quarter } = match.params;
    // Fetch all data in parallel.
    const [projectData, teamData] = await Promise.all([
      this.getProjects(year, quarter),
      this.getTeam(),
    ]);

    this.setState({
      projects: this.buildMetaData(projectData),
      team: teamData,
    });
  }

  projectSort(a, b) {
    const goalTypeA = a.meta.goalType ? a.meta.goalType : 'unclassified';
    const goalTypeB = b.meta.goalType ? b.meta.goalType : 'unclassified';
    return goalTypeA < goalTypeB ? -1 : goalTypeA > goalTypeB ? 1 : 0;
  }

  parseProjectMeta(HTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(HTML, 'text/html');
    const engineers = doc
      .evaluate(
        "//details//dl/dt[contains(., 'Engineering')]/following-sibling::dd[1]",
        doc,
        null,
        2,
        null,
      )
      .stringValue.replace(/ ?@/g, '')
      .split(',');
    const goalType = doc
      .evaluate(
        "//details//dl/dt[contains(., 'Goal Type')]/following-sibling::dd[1]",
        doc,
        null,
        2,
        null,
      )
      .stringValue.toLowerCase();
    const size = doc.evaluate(
      "//details//dl/dt[contains(., 'Size')]/following-sibling::dd[1]",
      doc,
      null,
      2,
      null,
    ).stringValue;
    const details = doc.querySelector('details');
    if (details) {
      // Remove the meta data HTML from the doc.
      // details.parentNode.removeChild(details);
    }
    return [{ engineers, goalType, size }, doc.documentElement.outerHTML];
  }

  // This function pre-computes counts and extracts metadata prior to the data being
  // added to the state. This way we're not running the same code over and over again
  // during the render.
  buildMetaData(projectData) {
    const newProjectData = { ...projectData };
    const augmentedProjects = newProjectData.data.organization.projects.nodes.map(
      (project, idx) => {
        const [meta, updatedHTML] = this.parseProjectMeta(project.bodyHTML);
        project.bodyHTML = updatedHTML;
        const todoColumn = project.columns.edges.find((column) => {
          return column.node.name === 'To do';
        });
        const inProgressColumn = project.columns.edges.find((column) => {
          return column.node.name === 'In progress';
        });
        const doneColumn = project.columns.edges.find((column) => {
          return column.node.name === 'Done';
        });
        const todoCount =
          (todoColumn && parseInt(todoColumn.node.cards.totalCount, 10)) || 0;
        const inProgressCount =
          (inProgressColumn &&
            parseInt(inProgressColumn.node.cards.totalCount, 10)) ||
          0;
        const doneCount =
          (doneColumn && parseInt(doneColumn.node.cards.totalCount, 10)) || 0;
        const totalCount = todoCount + inProgressCount + doneCount;

        // console.log(project.name, { todoCount, inProgressCount, doneCount, totalCount });

        const donePerc = (100 / totalCount) * doneCount;
        const inProgressPerc = (100 / totalCount) * inProgressCount;
        project.meta = {
          ...meta,
          todoCount,
          inProgressCount,
          doneCount,
          donePerc,
          inProgressPerc,
        };
        return project;
      },
    );
    newProjectData.data.organization.projects.nodes = augmentedProjects;
    return newProjectData;
  }

  render() {
    const { match } = this.props;
    const { year, quarter, projectType, engineer } = match.params;
    const projectsData = this.state.projects;
    const teamData = this.state.team;

    let projects = null;
    let currentProjectType = null;
    if (projectsData.data) {
      projectsData.data.organization.projects.nodes.sort(this.projectSort);
      projects = projectsData.data.organization.projects.nodes.map(
        (project, idx) => {
          if (projectType && projectType !== null) {
            if (!RegExp(projectType, 'i').test(project.meta.goalType)) {
              return null;
            }
          }

          let teamMembers = [];
          if (teamData.data) {
            for (const engineer of project.meta.engineers) {
              const foundMember = teamData.data.organization.team.members.nodes.find(
                (item) => {
                  return item.login.toLowerCase() === engineer.toLowerCase();
                },
              );
              if (foundMember) {
                teamMembers.push(foundMember);
              }
            }
          }

          if (
            engineer &&
            project.meta.engineers &&
            !project.meta.engineers.includes(engineer)
          ) {
            return null;
          }

          const projectNode = (
            <div className="card-wrapper" key={idx}>
              {!projectType && currentProjectType === null ? (
                <h2 className="project-type">Primary</h2>
              ) : null}
              {!projectType &&
              currentProjectType === 'primary' &&
              project.meta.goalType === 'secondary' ? (
                <h2 className="project-type">Secondary</h2>
              ) : null}
              <Card
                bg={project.meta.goalType === 'primary' ? 'muted' : 'light'}
              >
                <Card.Header as="h2">
                  <span>
                    <Octicon icon={Project} verticalAlign="middle" />
                    {project.name}
                  </span>
                  <div>
                    {teamMembers.map((member) => {
                      return (
                        <Link
                          key={member.login + project.name}
                          to={`/${year}/${quarter}/${member.login.toLowerCase()}/`}
                        >
                          <Image
                            src={member.avatarUrl}
                            title={member.login}
                            alt={member.login}
                            roundedCircle
                            className="float-right eng-image"
                            height="35"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </Card.Header>
                <ProgressBar>
                  <ProgressBar
                    variant="success"
                    now={project.meta.donePerc}
                    key={1}
                  />
                  <ProgressBar
                    variant="warning"
                    now={project.meta.inProgressPerc}
                    key={2}
                  />
                </ProgressBar>
                <Card.Body
                  dangerouslySetInnerHTML={{
                    __html: sanitize(project.bodyHTML),
                  }}
                />
                <Card.Footer bg="light">
                  <span className="updated float-left">
                    <Octicon icon={Clock} /> Updated{' '}
                    <TimeAgo date={project.updatedAt} />
                  </span>
                  <Button
                    href={project.url}
                    size="sm"
                    className="float-right"
                    variant="outline-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View Project
                  </Button>
                </Card.Footer>
              </Card>
              <br />
            </div>
          );

          currentProjectType = project.meta.goalType;
          return projectNode;
        },
      );
    }

    return (
      <div>
        <Helmet>
          <title>Projects</title>
        </Helmet>
        <Navbar
          variant="muted"
          bg="light"
          className="shadow-sm d-flex justify-content-between"
          sticky="top"
        >
          <BreadcrumbNav />
          <Nav variant="pills">
            <Nav.Item>
              <LinkContainer to={`/${year}/${quarter}/primary/`} exact>
                <Nav.Link>Primary Goals</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={`/${year}/${quarter}/secondary/`} exact>
                <Nav.Link>Secondary Goals</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to={`/${year}/${quarter}/`} exact>
                <Nav.Link
                  active={
                    `/${year}/${quarter}/` === this.props.location.pathname
                  }
                >
                  All Goals
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row>
            <Container as="main" bg="light">
              <br />
              <h1>
                Projects for {quarter} {year}{' '}
                {projectType
                  ? `(${projectType})`
                  : engineer
                  ? `(${engineer})`
                  : '(All)'}
              </h1>
              <br />
              {projectsData.data === null ? <p>Loading...</p> : null}
              {projects && projects.length ? (
                <CardDeck>{projects}</CardDeck>
              ) : projects && projects.length === 0 ? (
                <p>There are no Projects available for this quarter yet</p>
              ) : null}
            </Container>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Projects;
