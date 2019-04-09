import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Nav, Navbar, Table } from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import queryString from 'query-string';

import Octicon, { Link } from '@githubprimer/octicons-react';

import { LinkContainer } from 'react-router-bootstrap';
import Client from './Client';
import {
  alphaSort,
  dateSort,
  numericSort,
  hasLabelContainingString,
} from './utils';

import { priorities } from './const';

import './Milestones.scss';

class Milestones extends Component {
  state = {
    milestoneIssues: null,
  };

  formatData(data) {
    let issues = [];
    data.forEach((item) => {
      const issue = {
        ...item.issue,
        priority: null,
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
        issue.isContrib = true;
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

  async componentDidMount() {
    const [goodFirstBugs, maybeGoodFirstBugs] = await Promise.all([
      Client.getGoodFirstBugs(),
      Client.getMaybeGoodFirstBugs(),
    ]);
    this.setState({
      goodFirstBugs: this.formatData(
        goodFirstBugs.data.good_first_bugs.results,
      ),
      maybeGoodFirstBugs: this.formatData(
        maybeGoodFirstBugs.data.maybe_good_first_bugs.results,
      ),
    });
  }

  sortConfig = {
    assignee: {},
    priority: {},
    title: {},
    repo: {},
    updatedAt: {
      sortFunc: dateSort,
    },
  };

  sortData({ columnKey, direction } = {}) {
    const data = this.state.milestoneIssues;
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
    const { match } = this.props;

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
            <span className={issue.priority}>
              {issue.priority.toUpperCase()}
            </span>
          </td>
          <td>
            <a href={issue.url} target="_blank" rel="noopener noreferrer">
              <strong>#{issue.number}:</strong> {issue.title}{' '}
              <Octicon icon={Link} verticalAlign="middle" />
            </a>
          </td>
          <td>{issue.repository.name.replace('addons-', '')}</td>
          <td>
            <TimeAgo date={issue.updatedAt} />
          </td>
        </tr>,
      );
    }
    return rows;
  }

  render() {
    const { match, location } = this.props;
    const qs = queryString.parse(location.search);

    let data;

    const milestone = '2019.04.04';

    data = this.sortData({ columnKey: qs.sort, direction: qs.dir });

    return (
      <div className="Milestones">
        <Helmet>
          <title>Milestones</title>
        </Helmet>
        <Navbar
          variant="muted"
          bg="light"
          className="shadow-sm d-flex justify-content-between"
          sticky="top"
        >
          <Nav variant="pills">
            <Nav.Item>
              <LinkContainer to="/milestones/previous/" exact>
                <Nav.Link eventKey="mgfb" className="previous">
                  Previous
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/milestones/next/" exact>
                <Nav.Link eventKey="gfb" className="next">
                  Next
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Container as="main" bg="light">
          <h2>Issues for milestone: {milestone}</h2>
          <Table responsive hover>
            <thead>
              <tr>
                <th>{this.renderHeaderLink('assignee', 'Assignee')}</th>
                <th>{this.renderHeaderLink('priority', 'Priority')}</th>
                <th className="issue">
                  {this.renderHeaderLink('title', 'Issue')}
                </th>
                <th>{this.renderHeaderLink('repo', 'Repo')}</th>
                <th>{this.renderHeaderLink('isProjectBug', 'Project Bug?')}</th>
                <th className="last-updated">
                  {this.renderHeaderLink('updatedAt', 'Last Update')}
                </th>
                <th className="state">
                  {this.renderHeaderLink('state', 'State')}
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

export default Milestones;
