import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Nav, Navbar, Table } from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import queryString from 'query-string';

import Octicon, {
  Alert,
  Link,
  Heart,
  Person,
} from '@githubprimer/octicons-react';

import { LinkContainer } from 'react-router-bootstrap';
import { getMilestonePagination, getNextMilestone } from './utils';
import Client from './Client';
import {
  alphaSort,
  colourIsLight,
  dateSort,
  hasLabelContainingString,
  hasLabel,
} from './utils';

import { colors, priorities } from '../const';

import './Milestones.scss';

const defaultSort = 'assignee';
const defaultSortDir = 'asc';

class Milestones extends Component {
  state = {
    milestoneIssues: null,
    pagination: {},
  };

  formatData(data) {
    let issues = [];

    data.forEach((item) => {
      const issue = {
        ...item.issue,
        priority: null,
        hasProject: false,
        isContrib: false,
        assignee: '00_unassigned',
      };
      const labels = issue.labels.nodes || [];
      priorities.forEach((priority) => {
        if (hasLabelContainingString(labels, priority)) {
          issue.priority = priority;
        }
      });
      if (hasLabelContainingString(labels, 'contrib: assigned')) {
        issue.isContrib = true;
        issue.assignee = '01_contributor';
      }
      if (issue.repository && issue.repository.name) {
        issue.repo = issue.repository.name;
      }
      if (issue.projectCards.nodes.length) {
        issue.hasProject = true;
        issue.projectUrl = issue.projectCards.nodes[0].project.url;
        issue.projectName = issue.projectCards.nodes[0].project.name;
      }

      issue.stateLabel = issue.state.toLowerCase();
      issue.stateLabelColor =
        issue.state === 'CLOSED' ? colors.closed : colors.open;

      if (
        issue.state === 'OPEN' &&
        hasLabel(labels, 'state: pull request ready')
      ) {
        issue.stateLabel = 'PR ready';
        issue.stateLabelColor = colors.prReady;
      } else if (
        issue.state === 'OPEN' &&
        hasLabel(labels, 'state: in progress')
      ) {
        issue.stateLabel = 'in progress';
        issue.stateLabelColor = colors.inProgress;
      } else if (
        issue.state === 'CLOSED' &&
        hasLabel(labels, 'state: verified fixed')
      ) {
        issue.stateLabel = 'verified fixed';
        issue.stateLabelColor = colors.verified;
      } else if (
        issue.state === 'CLOSED' &&
        hasLabel(labels, 'qa: not needed')
      ) {
        issue.stateLabel = 'closed QA-';
        issue.stateLabelColor = colors.verified;
      }

      issue.stateLabelTextColor = colourIsLight(issue.stateLabelColor)
        ? '#000'
        : '#fff';

      if (issue.assignees.nodes.length) {
        issue.assignee = issue.assignees.nodes[0].login;
      }

      issues.push(issue);
    });

    return issues;
  }

  renderBoolAsYesOrNo(issue, prop) {
    let comp = <span className="no">NO</span>;
    if (issue[prop] === true) {
      comp = <span className="yes">YES</span>;
    }
    return comp;
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

  async componentDidUpdate(prevProps, prevState) {
    await this.updateComponentData(prevProps, prevState);
  }

  async componentDidMount() {
    await this.updateComponentData();
  }

  async updateComponentData(prevProps, prevState) {
    const { match } = this.props;
    const { milestone, year, month, day } = match.params;

    // Check if we need to recalculate anything.
    if (prevProps && prevProps.match) {
      const prevMatch = prevProps.match;
      if (
        prevMatch.params.milestone === milestone &&
        prevMatch.params.year === year &&
        prevMatch.params.month === month &&
        prevMatch.params.day === day
      ) {
        console.log('No changes to milestone props, skipping update');
        return;
      }
    }

    let milestoneTag;
    let milestonePagination;

    if (milestone === 'latest') {
      milestonePagination = getMilestonePagination({
        startDate: getNextMilestone(),
      });
      milestoneTag = milestonePagination.current;
      // Update the URL from '/milestones/latest/...' to the permalink URL.
      this.props.history.push(
        `/milestones/${
          milestonePagination.current
        }/${this.getCurrentSortQueryString()}`,
      );
    } else {
      milestoneTag = `${year}.${month}.${day}`;
      milestonePagination = getMilestonePagination({
        startDate: new Date(year, month - 1, day),
      });
    }

    const milestoneIssues = await Client.getMilestoneIssues(milestoneTag);

    this.setState({
      pagination: milestonePagination,
      milestoneIssues: milestoneIssues.data
        ? this.formatData(milestoneIssues.data.milestone_issues.results)
        : [],
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
    hasProject: {},
    state: {},
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

  getCurrentSortQueryString() {
    const { location } = this.props;
    const qs = queryString.parse(location.search);
    return `?${queryString.stringify({
      dir: defaultSortDir,
      sort: defaultSort,
      ...qs,
    })}`;
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

  renderAssignee(issue) {
    if (issue.assignees.nodes.length) {
      const issueAssignee = issue.assignees.nodes[0];
      return (
        <span>
          <img className="avatar" src={issueAssignee.avatarUrl} alt="" />{' '}
          {issueAssignee.login}
        </span>
      );
    } else if (issue.assignee === '01_contributor') {
      return (
        <span className="contributor">
          <Octicon icon={Heart} verticalAlign="middle" /> Contributor
        </span>
      );
    }
    return (
      <span className="unassigned">
        <Octicon icon={Person} verticalAlign="middle" /> Unassigned
      </span>
    );
  }

  renderRows(data) {
    const rows = [];
    const colSpan = 7;

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
            <p>There are no issues associated with this milestone yet.</p>
          </td>
        </tr>
      );
    }
    for (var i = 0; i < data.length; i++) {
      const issue = data[i] || {};
      rows.push(
        <tr key={`issue-${i}`}>
          <td className="assignee">{this.renderAssignee(issue)}</td>
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
            <a
              className="issueLink"
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>#{issue.number}:</strong> {issue.title}{' '}
              <Octicon icon={Link} verticalAlign="middle" />
            </a>
            {issue.hasProject ? (
              <a
                href={issue.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="projectLink"
              >
                {issue.projectName}
              </a>
            ) : null}
          </td>
          <td>{issue.repository.name.replace('addons-', '')}</td>
          <td>
            <TimeAgo date={issue.updatedAt} />
          </td>
          <td>
            <span
              className="label"
              style={{
                backgroundColor: issue.stateLabelColor,
                color: issue.stateLabelTextColor,
              }}
            >
              {issue.stateLabel}
            </span>
          </td>
        </tr>,
      );
    }
    return rows;
  }

  render() {
    const { location } = this.props;
    const qs = queryString.parse(location.search);
    const milestone = this.state.pagination.start || 'Loading...';
    let data = this.state.milestoneIssues;
    if (qs.sort) {
      data = this.sortData({ columnKey: qs.sort, direction: qs.dir });
    }

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
              <LinkContainer
                to={`/milestones/${
                  this.state.pagination.prevFromStart
                }/${this.getCurrentSortQueryString()}`}
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
                to={`/milestones/${
                  this.state.pagination.nextFromStart
                }/${this.getCurrentSortQueryString()}`}
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
                to={`/milestones/${
                  this.state.pagination.current
                }/${this.getCurrentSortQueryString()}`}
                isActive={(match, location) => {
                  return (
                    location.pathname.indexOf(this.state.pagination.current) >
                      -1 || location.pathname.indexOf('latest') > -1
                  );
                }}
              >
                <Nav.Link eventKey="current" className="current">
                  Current Milestone
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
