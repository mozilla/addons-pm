import React from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import { Container, Nav, Navbar, Table } from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import { AlertIcon, LinkIcon } from '@primer/octicons-react';
import { dateSort, numericSort, sortData } from 'lib/utils/sort';
import { hasLabelContainingString } from 'lib/utils';
import YesNoBool from 'components/YesNoBool';
import HeaderLink from 'components/HeaderLink';
import ActiveLink from 'components/ActiveLink';
import { priorities } from 'lib/const';

// These views display assignment columns.
const sortConfig = {
  priority: {},
  title: {},
  repo: {},
  assigned: {
    sortFunc: numericSort,
  },
  mentorAssigned: {
    sortFunc: numericSort,
  },
  updatedAt: {
    sortFunc: dateSort,
  },
};

export function formatData(data) {
  const issues = [];
  data.forEach((item) => {
    const issue = {
      ...item.issue,
      priority: '',
      assigned: false,
      mentorAssigned: false,
    };
    const labels = issue.labels.nodes || [];
    priorities.forEach((priority) => {
      if (hasLabelContainingString(labels, priority)) {
        issue.priority = priority;
      }
    });
    if (hasLabelContainingString(labels, 'contrib: assigned')) {
      issue.assigned = true;
    }
    if (hasLabelContainingString(labels, 'contrib: mentor assigned')) {
      issue.mentorAssigned = true;
    }
    if (issue.repository && issue.repository.name) {
      issue.repo = issue.repository.name;
    }
    issues.push(issue);
  });
  return issues;
}

function renderRows({ data, hasAssignments }) {
  const rows = [];
  const colSpan = 4;

  if (!data) {
    return (
      <tr>
        <td colSpan={colSpan}>Loading...</td>
      </tr>
    );
  }

  if (data.length === 0) {
    return (
      <tr>
        <td colSpan={colSpan}>
          <div className="not-found">
            <p>
              No issues found! Time to deploy the team to find some quality
              bugs!
            </p>
          </div>
        </td>
      </tr>
    );
  }

  for (let i = 0; i < data.length; i++) {
    const issue = data[i];

    rows.push(
      <tr key={`issue-${i}`}>
        <td>
          <span className={issue.priority || 'unprioritized'}>
            {issue.priority ? issue.priority.toUpperCase() : <AlertIcon />}
          </span>
        </td>
        <td>
          <a href={issue.url} target="_blank" rel="noopener noreferrer">
            <strong>#{issue.number}:</strong> {issue.title}{' '}
            <LinkIcon verticalAlign="middle" />
          </a>
        </td>
        <td>{issue.repository.name.replace('addons-', '')}</td>
        {hasAssignments ? (
          <td className="centered">
            <YesNoBool
              bool={issue.assigned}
              extraClasses={{
                yes: ['contributor'],
                no: ['contributor', 'not-assigned'],
              }}
            />
          </td>
        ) : null}
        {hasAssignments ? (
          <td className="centered">
            <YesNoBool
              bool={issue.mentorAssigned}
              extraClasses={{
                yes: ['mentor'],
                no: ['mentor', 'not-assigned'],
              }}
            />
          </td>
        ) : null}
        <td>
          <TimeAgo date={issue.updatedAt} />
        </td>
      </tr>,
    );
  }
  return rows;
}

const Contrib = (props) => {
  const router = useRouter();
  const { dir, sort } = router.query;
  const { contribData, hasAssignments } = props;

  let data = contribData;
  if (sort) {
    data = sortData({ data, columnKey: sort, direction: dir, sortConfig });
  }

  return (
    <div className="Contrib">
      <Helmet>
        <title>Contributions</title>
      </Helmet>
      <Navbar
        variant="muted"
        bg="light"
        className="shadow-sm d-flex justify-content-between"
        sticky="top"
      >
        <Nav variant="pills">
          <Nav.Item>
            <ActiveLink
              href="/contrib/maybe-good-first-bugs/?dir=desc&sort=updatedAt"
              passHref
            >
              <Nav.Link eventKey="mgfb">Maybe Good First Bugs</Nav.Link>
            </ActiveLink>
          </Nav.Item>
          <Nav.Item>
            <ActiveLink
              href="/contrib/good-first-bugs/?dir=desc&sort=updatedAt"
              passHref
            >
              <Nav.Link eventKey="gfb">Good First Bugs</Nav.Link>
            </ActiveLink>
          </Nav.Item>
          <Nav.Item>
            <ActiveLink
              href="/contrib/contrib-welcome/?dir=desc&sort=updatedAt"
              passHref
            >
              <Nav.Link eventKey="cw">Contrib Welcome</Nav.Link>
            </ActiveLink>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Container as="main" bg="light">
        <Table responsive hover>
          <thead>
            <tr>
              <th>
                <HeaderLink columnKey="priority" linkText="Priority" />
              </th>
              <th>
                <HeaderLink columnKey="title" linkText="Issue" />
              </th>
              <th className="repo">
                <HeaderLink columnKey="repo" linkText="Repo" />
              </th>
              {hasAssignments ? (
                <th>
                  <HeaderLink columnKey="assigned" linkText="Assigned?" />
                </th>
              ) : null}
              {hasAssignments ? (
                <th>
                  <HeaderLink
                    columnKey="mentorAssigned"
                    linkText="Has Mentor?"
                  />
                </th>
              ) : null}
              <th className="last-updated">
                <HeaderLink columnKey="updatedAt" linkText="Last Update" />
              </th>
            </tr>
          </thead>
          <tbody>{renderRows({ data, hasAssignments })}</tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Contrib;
