import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import Error from 'next/error';
import {
  Button,
  Card,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  ProgressBar,
} from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import { ProjectIcon, ClockIcon } from '@primer/octicons-react';
import { getApiURL, sanitize } from 'lib/utils';
import {
  getCurrentQuarter,
  getNextQuarter,
  getPrevQuarter,
  parseProjectMeta,
} from 'lib/utils/projects';
import Engineer from 'components/Engineer';
import ActiveLink from 'components/ActiveLink';

export function projectSort(a, b) {
  const goalTypeA = a.meta.goalType ? a.meta.goalType : 'unclassified';
  const goalTypeB = b.meta.goalType ? b.meta.goalType : 'unclassified';
  return goalTypeA < goalTypeB ? -1 : goalTypeA > goalTypeB ? 1 : 0;
}

// This function pre-computes counts and extracts metadata prior to the data being
// added to the state. This way we're not running the same code over and over again
// during the render.
function buildMetaData(projectData) {
  const newProjectData = { ...projectData };
  if (projectData.data) {
    const augmentedProjects =
      newProjectData.data.organization.projects.nodes.map((project) => {
        const [meta, updatedHTML] = parseProjectMeta(project.bodyHTML);
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
        const donePerc = totalCount ? (100 / totalCount) * doneCount : 0;
        const inProgressPerc = totalCount
          ? (100 / totalCount) * inProgressCount
          : 0;
        project.meta = {
          ...meta,
          todoCount,
          inProgressCount,
          doneCount,
          donePerc,
          inProgressPerc,
        };
        return project;
      });
    newProjectData.data.organization.projects.nodes = augmentedProjects;
  }
  return newProjectData;
}

export async function getServerSideProps(props) {
  const { year, quarter } = props.params;
  const projectURL = getApiURL('/api/gh-projects/', { quarter, year });
  const teamURL = getApiURL('/api/gh-team/');
  const [projectResponse, teamResponse] = await Promise.all([
    fetch(projectURL),
    fetch(teamURL),
  ]);

  const errorCode = projectResponse.ok ? false : projectResponse.status;
  const projects = await projectResponse.json();
  const team = await teamResponse.json();

  return {
    props: {
      errorCode,
      projects: buildMetaData(projects),
      team,
    },
  };
}

const Projects = (props) => {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

  const router = useRouter();
  const { year, quarter, projectType, engineer } = router.query;
  const projectURL = getApiURL('/api/gh-projects/', { quarter, year });
  const teamData = props.team;
  const initialProjectsData = props.projects;
  const { data: projectsData } = useSWR(
    projectURL,
    async () => {
      const result = await fetch(projectURL);
      const json = await result.json();
      return buildMetaData(json);
    },
    { fallbackData: initialProjectsData, refreshInterval: 30000 },
  );

  let projects = null;
  let currentProjectType = null;
  if (projectsData.data) {
    projectsData.data.organization.projects.nodes.sort(projectSort);
    projects = projectsData.data.organization.projects.nodes.map((project) => {
      if (projectType && projectType !== null) {
        if (!RegExp(projectType, 'i').test(project.meta.goalType)) {
          return null;
        }
      }

      const teamMembers = [];
      if (teamData.data) {
        for (const eng of project.meta.engineers) {
          const foundMember = teamData.data.search.edges.find((item) => {
            return item.node.login.toLowerCase() === eng.toLowerCase();
          });
          if (foundMember) {
            teamMembers.push(foundMember.node);
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
        <div className="card-wrapper" key={project.name}>
          {!projectType && currentProjectType === null ? (
            <h2 className="project-type">Primary</h2>
          ) : null}
          {!projectType &&
          currentProjectType === 'primary' &&
          project.meta.goalType === 'secondary' ? (
            <h2 className="project-type">Secondary</h2>
          ) : null}
          <Card bg={project.meta.goalType === 'primary' ? 'muted' : 'light'}>
            <Card.Header as="h2">
              <span>
                <ProjectIcon verticalAlign="middle" />
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
              <span className="updated float-start">
                <ClockIcon /> Updated&nbsp;
                <TimeAgo date={project.updatedAt} />
              </span>
              <Button
                href={project.url}
                size="sm"
                className="float-end"
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
    });
  }

  // Filter null elements. This avoids a case where we have
  // a projects list that looks like [null, null].
  if (projects && projects.length) {
    projects = projects.filter((el) => {
      return el !== null;
    });
  }

  const { year: currentYear, quarter: currentQuarter } = getCurrentQuarter();
  const { year: prevYear, quarter: prevQuarter } = getPrevQuarter({
    year,
    quarter,
  });
  const { year: nextYear, quarter: nextQuarter } = getNextQuarter({
    year,
    quarter,
  });

  return (
    <div>
      <Helmet>
        <title>Projects</title>
      </Helmet>
      <Navbar
        variant="muted"
        bg="light"
        className="shadow-sm d-flex justify-content-between px-3"
        sticky="top"
      >
        <Nav variant="pills">
          <Nav.Item>
            <Link
              href={`/projects/${prevYear}/${prevQuarter}/`}
              passHref
              legacyBehavior
            >
              <Nav.Link eventKey="prev" className="previous" active={false}>
                Previous
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              href={`/projects/${nextYear}/${nextQuarter}/`}
              passHref
              legacyBehavior
            >
              <Nav.Link eventKey="next" className="next" active={false}>
                Next
              </Nav.Link>
            </Link>
          </Nav.Item>
        </Nav>

        <Nav variant="pills">
          <Nav.Item>
            <ActiveLink
              href={`/projects/${currentYear}/${currentQuarter}/`}
              activeClassName="active"
              passHref
            >
              <Nav.Link eventKey="current">Current Quarter</Nav.Link>
            </ActiveLink>
          </Nav.Item>

          <NavDropdown className="filters" title="Filters" align="end">
            <Link
              href={`/projects/${year}/${quarter}/`}
              passHref
              legacyBehavior
            >
              <NavDropdown.Item eventKey="all">All</NavDropdown.Item>
            </Link>
            <Link
              href={`/projects/${year}/${quarter}/?projectType=primary`}
              passHref
              legacyBehavior
            >
              <NavDropdown.Item eventKey="primary">Primary</NavDropdown.Item>
            </Link>
            <Link
              href={`/projects/${year}/${quarter}/?projectType=secondary`}
              passHref
              legacyBehavior
            >
              <NavDropdown.Item eventKey="secondary">
                Secondary
              </NavDropdown.Item>
            </Link>
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
              <div>{projects}</div>
            ) : projects && projects.length === 0 ? (
              <p>There are no Projects available for this quarter yet</p>
            ) : null}
          </Container>
        </Row>
      </Container>
    </div>
  );
};

export default Projects;
