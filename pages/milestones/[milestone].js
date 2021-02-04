import React from 'react';
import useSWR from 'swr';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Nav, Navbar, Table } from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import queryString from 'query-string';
import {
  AlertIcon,
  HeartIcon,
  LinkIcon,
  PersonIcon,
} from '@primer/octicons-react';
import { getMilestonePagination, formatIssueData } from 'lib/utils/milestones';
import { dateSort, sortData } from 'lib/utils/sort';
import { validMilestoneRX } from 'lib/const';
import ActiveLink from 'components/ActiveLink';
import HeaderLink from 'components/HeaderLink';

const defaultSort = 'assignee';
const defaultSortDir = 'asc';
const sortConfig = {
  assignee: {},
  priority: {},
  title: {},
  repo: {},
  updatedAt: {
    sortFunc: dateSort,
  },
  hasProject: {},
  state: {},
  reviewersNames: {},
};

function getCurrentSortQueryString() {
  const router = useRouter();
  const { sort, dir } = router.query;
  return `?${queryString.stringify({
    dir: dir || defaultSortDir,
    sort: sort || defaultSort,
  })}`;
}

function renderAssignee(issue) {
  if (issue.assignees.nodes.length) {
    const issueAssignee = issue.assignees.nodes[0];
    return (
      <span>
        <img className="avatar" src={issueAssignee.avatarUrl} alt="" />{' '}
        {issueAssignee.login}
      </span>
    );
  }

  if (issue.assignee === '01_contributor') {
    return (
      <span className="contributor">
        <HeartIcon verticalAlign="middle" /> Contributor
      </span>
    );
  }

  return (
    <span className="unassigned">
      <PersonIcon verticalAlign="middle" /> Unassigned
    </span>
  );
}

function renderReviewers(issue) {
  const reviewers = [];
  issue.reviewers.forEach((item) => {
    reviewers.push(
      <React.Fragment key={`${issue.number}-${item.author.login}`}>
        <a href={item.prLink} target="_blank" rel="noopener noreferrer">
          <img
            className="avatar"
            src={item.author.avatarUrl}
            title={`Reviewed by ${item.author.login}`}
            alt=""
          />
        </a>
      </React.Fragment>,
    );
  });
  return reviewers;
}

function renderRows({ data }) {
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
  for (let i = 0; i < data.length; i++) {
    const issue = data[i] || {};
    rows.push(
      <tr key={`issue-${i}`}>
        <td className="assignee">{renderAssignee(issue)}</td>
        <td>
          <span className={issue.priority || 'unprioritized'}>
            {issue.priority ? issue.priority.toUpperCase() : <AlertIcon />}
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
            <LinkIcon verticalAlign="middle" />
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
        <td className="reviewers">{renderReviewers(issue)}</td>
      </tr>,
    );
  }
  return rows;
}

export async function getServerSideProps(props) {
  const { milestone } = props.params;
  const milestoneIssuesURL = `${
    process.env.API_HOST
  }/api/gh-milestone-issues/?${queryString.stringify({
    milestone,
  })}`;

  const milestoneIssueReponse = await fetch(milestoneIssuesURL);
  const milestoneIssueData = await milestoneIssueReponse.json();

  return {
    props: {
      milestoneIssues: formatIssueData(
        milestoneIssueData.data.milestone_issues.results,
      ),
      milestoneIssuesURL,
    },
  };
}

const Milestones = (props) => {
  const router = useRouter();
  const { sort, dir, milestone } = router.query;
  const {
    groups: { year, month, day },
  } = validMilestoneRX.exec(milestone);
  const milestonePagination = getMilestonePagination({
    startDate: new Date(year, month - 1, day),
  });

  const initialMilestoneIssues = props.milestoneIssues;
  const { data: milestoneIssues } = useSWR(
    props.milestoneIssuesURL,
    async () => {
      const result = await fetch(props.milestoneIssuesURL);
      const json = await result.json();
      return formatIssueData(json);
    },
    { initialData: initialMilestoneIssues, refreshInterval: 30000 },
  );

  let data = milestoneIssues;
  if (sort) {
    data = sortData({ data, columnKey: sort, direction: dir, sortConfig });
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
            <Link
              href={`/milestones/${
                milestonePagination.prevFromStart
              }/${getCurrentSortQueryString()}`}
              passHref
            >
              <Nav.Link eventKey="prev" className="previous" active={false}>
                Previous
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link
              href={`/milestones/${
                milestonePagination.nextFromStart
              }/${getCurrentSortQueryString()}`}
              passHref
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
              href={`/milestones/${
                milestonePagination.current
              }/${getCurrentSortQueryString()}`}
              activeClassName="active"
              passHref
            >
              <Nav.Link eventKey="current" className="current">
                Current Milestone
              </Nav.Link>
            </ActiveLink>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Container as="main" bg="light">
        <h1>Issues for milestone: {milestone}</h1>
        <Table responsive hover>
          <thead>
            <tr>
              <th className="assignees">
                <HeaderLink columnKey="assignee" linkText="Assignee" />
              </th>
              <th>
                <HeaderLink columnKey="priority" linkText="Priority" />
              </th>
              <th className="issue">
                <HeaderLink columnKey="title" linkText="Issue" />
              </th>
              <th className="repo">
                <HeaderLink columnKey="repo" linkText="Repo" />
              </th>
              <th className="last-updated">
                <HeaderLink columnKey="updatedAt" linkText="Last Update" />
              </th>
              <th className="state">
                <HeaderLink columnKey="state" linkText="State" />
              </th>
              <th>
                <HeaderLink columnKey="reviewersNames" linkText="Reviewers" />
              </th>
            </tr>
          </thead>
          <tbody>{renderRows({ data })}</tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Milestones;
