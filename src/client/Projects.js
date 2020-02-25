import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { sanitize } from './utils';
import {
  Button,
  Card,
  CardDeck,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  ProgressBar,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import TimeAgo from 'react-timeago';
import Octicon, { Clock, Project } from '@githubprimer/octicons-react';

import Client from './Client';
import Engineer from './components/Engineer';

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

  async componentDidUpdate(prevProps, prevState) {
    await this.updateComponentData(prevProps, prevState);
  }

  async componentDidMount() {
    await this.updateComponentData();
  }

  async updateComponentData(prevProps, prevState) {
    const { match } = this.props;
    let { year, quarter } = match.params;

    // Check if we need to recalculate anything.
    if (prevProps && prevProps.match) {
      const prevMatch = prevProps.match;
      if (
        prevMatch.params.year === year &&
        prevMatch.params.quarter === quarter
      ) {
        console.log('No changes to project props, skipping update');
        return;
      }
    }

    // Scroll to top when new data loads.
    window.scrollTo(0, 0);

    if (year === 'latest') {
      // Work out the current year/milestone.
      const {
        year: currentYear,
        quarter: currentQuarter,
      } = this.getCurrentQuarter();
      year = currentYear;
      quarter = currentQuarter;

      // Update the url.
      this.props.history.push(`/projects/${year}/${quarter}/`);
    }

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

  getCurrentQuarter() {
    const today = new Date();
    const year = today.getFullYear();
    const quarter = `Q${Math.floor((today.getMonth() + 3) / 3)}`;
    return {
      year,
      quarter,
    };
  }

  getPrevQuarter() {
    const { match } = this.props;
    let { quarter, year } = match.params;

    if (!quarter || !year) {
      return {};
    }

    const numericQuarter = quarter.substr(1);
    let newQuarter = parseInt(numericQuarter, 10);
    let newYear = parseInt(year, 10);

    if (newQuarter > 1) {
      newQuarter = newQuarter - 1;
    } else if (newQuarter === 1) {
      newQuarter = 4;
      newYear = newYear - 1;
    }

    return {
      year: newYear,
      quarter: `Q${newQuarter}`,
    };
  }

  getNextQuarter() {
    const { match } = this.props;
    let { quarter, year } = match.params;

    if (!quarter || !year) {
      return {};
    }

    const numericQuarter = quarter.substr(1);
    let newYear = parseInt(year, 10);
    let newQuarter = parseInt(numericQuarter, 10);

    if (newQuarter < 4) {
      newQuarter = newQuarter + 1;
    } else if (newQuarter === 4) {
      newQuarter = 1;
      newYear = newYear + 1;
    }

    return {
      year: newYear,
      quarter: `Q${newQuarter}`,
    };
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
                        <Engineer
                          key={member.login + project.name}
                          member={member}
                          project={project}
                          year={year}
                          quarter={quarter}
                        />
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

    // Filter null elements. This avoids a case where we have
    // a projects list that looks like [null, null].
    if (projects && projects.length) {
      projects = projects.filter((el) => {
        return el !== null;
      });
    }

    const {
      year: currentYear,
      quarter: currentQuarter,
    } = this.getCurrentQuarter();
    const { year: prevYear, quarter: prevQuarter } = this.getPrevQuarter();
    const { year: nextYear, quarter: nextQuarter } = this.getNextQuarter();

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
          <Nav variant="pills">
            <Nav.Item>
              <LinkContainer
                to={`/projects/${prevYear}/${prevQuarter}/`}
                active={false}
                exact
              >
                <Nav.Link eventKey="prev" className="previous">
                  Previous
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to={`/projects/${nextYear}/${nextQuarter}/`}
                active={false}
                exact
              >
                <Nav.Link eventKey="next" className="next">
                  Next
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>

          <Nav variant="pills">
            <Nav.Item>
              <LinkContainer
                to={`/projects/${currentYear}/${currentQuarter}/`}
                exact
              >
                <Nav.Link
                  eventKey="current"
                  active={
                    this.props.location.pathname.indexOf(
                      `/projects/${currentYear}/${currentQuarter}/`,
                    ) === 0
                  }
                >
                  Current Quarter
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <NavDropdown className="filters" title="Filters" alignRight>
              <LinkContainer to={`/projects/${year}/${quarter}/`} exact>
                <NavDropdown.Item
                  eventKey="all"
                  href={`/projects/${year}/${quarter}/`}
                >
                  All
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to={`/projects/${year}/${quarter}/primary/`} exact>
                <NavDropdown.Item
                  eventKey="primary"
                  href={`/projects/${year}/${quarter}/primary/`}
                >
                  Primary
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to={`/projects/${year}/${quarter}/secondary/`}
                exact
              >
                <NavDropdown.Item
                  eventKey="secondary"
                  href={`/projects/${year}/${quarter}/secondary/`}
                >
                  Secondary
                </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar>

        <Container fluid>
          <Row>
            <Container as="main" bg="light">
              <h1>
                Projects for {quarter} {year}{' '}
                {projectType
                  ? `(${projectType})`
                  : engineer
                  ? `(${engineer})`
                  : '(All)'}
              </h1>
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
