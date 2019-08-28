import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Nav, Navbar, Table } from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import queryString from 'query-string';

import Octicon, { Alert, Link } from '@githubprimer/octicons-react';

import { LinkContainer } from 'react-router-bootstrap';
import {
  alphaSort,
  dateSort,
  numericSort,
  hasLabelContainingString,
} from './utils';

import { priorities } from '../const';

import './Contrib.scss';

// These views display assigment columns.
const dataKeysWithAssignment = ['goodFirstBugs', 'contribWelcome'];

class BaseContrib extends Component {
  formatData(data) {
    let issues = [];
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

  setArrow(column) {
    const { location } = this.props;
    const qs = queryString.parse(location.search);
    let className = 'sort-direction';
    if (qs.sort === column) {
      className = `${className} ${qs.dir === 'asc' ? ' asc' : ' desc'}`;
    }
    return className;
  }

  sortConfig = {
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

  sortData({ dataKey, columnKey, direction } = {}) {
    const data = this.state[dataKey];
    if (!data) {
      console.debug('No data yet, bailing');
      return data;
    }
    if (!Object.keys(this.sortConfig).includes(columnKey)) {
      console.debug(
        `"${columnKey}" does not match one of "${Object.keys(
          this.sortConfig,
        ).join(', ')}"`,
      );
      return data;
    }
    if (!['desc', 'asc'].includes(direction)) {
      console.debug(`"${direction}" does not match one of 'asc' or 'desc'`);
      return data;
    }

    const sortFunc = this.sortConfig[columnKey].sortFunc || alphaSort;
    const sorted = [].concat(data).sort(sortFunc(columnKey));

    // Reverse for desc.
    if (direction === 'desc') {
      sorted.reverse();
    }
    return sorted;
  }

  renderMentorAssigned(issue) {
    let mentorAssigned = <span className="mentor not-assigned">NO</span>;
    if (issue.mentorAssigned) {
      mentorAssigned = <span className="mentor">YES</span>;
    }
    return mentorAssigned;
  }

  renderContribAssigned(issue) {
    let assigned = <span className="contributor not-assigned">NO</span>;
    if (issue.assigned) {
      assigned = <span className="contributor">YES</span>;
    }
    return assigned;
  }

  renderHeaderLink(column, name) {
    const { location } = this.props;
    const qs = queryString.parse(location.search);
    const sort = qs.sort;
    let linkDir = 'desc';
    let classDir = qs.dir === 'asc' ? 'asc' : 'desc';
    let className = 'sort-direction';
    if (sort === column) {
      linkDir = qs.dir === 'desc' ? 'asc' : 'desc';
      className = `${className} ${classDir}`;
    }
    const query = `?${queryString.stringify({
      ...qs,
      dir: linkDir,
      sort: column,
    })}`;

    return (
      <LinkContainer to={query}>
        <a className={className} href={query}>
          {name}
        </a>
      </LinkContainer>
    );
  }

  renderRows(data) {
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

    for (var i = 0; i < data.length; i++) {
      const issue = data[i] || {};
      rows.push(
        <tr key={`issue-${i}`}>
          <td>
            <span className={issue.priority || 'unprioritized'}>
              {issue.priority ? (
                issue.priority.toUpperCase()
              ) : (
                <Octicon icon={Alert} />
              )}
            </span>
          </td>
          <td>
            <a href={issue.url} target="_blank" rel="noopener noreferrer">
              <strong>#{issue.number}:</strong> {issue.title}{' '}
              <Octicon icon={Link} verticalAlign="middle" />
            </a>
          </td>
          <td>{issue.repository.name.replace('addons-', '')}</td>
          {dataKeysWithAssignment.includes(this.state.dataKey) ? (
            <td className="centered">{this.renderContribAssigned(issue)}</td>
          ) : null}
          {dataKeysWithAssignment.includes(this.state.dataKey) ? (
            <td className="centered">{this.renderMentorAssigned(issue)}</td>
          ) : null}
          <td>
            <TimeAgo date={issue.updatedAt} />
          </td>
        </tr>,
      );
    }
    return rows;
  }

  render() {
    const { location } = this.props;
    const qs = queryString.parse(location.search);

    let data;
    const dataKey = this.state.dataKey;

    data = this.state[dataKey];
    if (qs.sort) {
      data = this.sortData({ dataKey, columnKey: qs.sort, direction: qs.dir });
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
              <LinkContainer
                to="/contrib/maybe-good-first-bugs/?dir=desc&sort=updatedAt"
                isActive={(match, location) => {
                  return (
                    location.pathname.indexOf(
                      '/contrib/maybe-good-first-bugs',
                    ) > -1
                  );
                }}
                exact
              >
                <Nav.Link eventKey="mgfb">Maybe Good First Bugs</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/contrib/good-first-bugs/?dir=desc&sort=updatedAt"
                isActive={(match, location) => {
                  return (
                    location.pathname.indexOf('/contrib/good-first-bugs') > -1
                  );
                }}
                exact
              >
                <Nav.Link eventKey="gfb">Good First Bugs</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/contrib/contrib-welcome/?dir=desc&sort=updatedAt"
                isActive={(match, location) => {
                  return (
                    location.pathname.indexOf('/contrib/contrib-welcome') > -1
                  );
                }}
                exact
              >
                <Nav.Link eventKey="gfb">Contrib Welcome</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Container as="main" bg="light">
          <Table responsive hover>
            <thead>
              <tr>
                <th>{this.renderHeaderLink('priority', 'Priority')}</th>
                <th>{this.renderHeaderLink('title', 'Issue')}</th>
                <th className="repo">
                  {this.renderHeaderLink('repo', 'Repo')}
                </th>
                {dataKeysWithAssignment.includes(dataKey) ? (
                  <th>{this.renderHeaderLink('assigned', 'Assigned?')}</th>
                ) : null}
                {dataKeysWithAssignment.includes(dataKey) ? (
                  <th>
                    {this.renderHeaderLink('mentorAssigned', 'Has Mentor?')}
                  </th>
                ) : null}
                <th className="last-updated">
                  {this.renderHeaderLink('updatedAt', 'Last Update')}
                </th>
              </tr>
            </thead>
            <tbody>{this.renderRows(data)}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default BaseContrib;
