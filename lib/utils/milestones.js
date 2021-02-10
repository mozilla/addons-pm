import { oneLineTrim } from 'common-tags';
import { colors, priorities } from 'lib/const';
import { colourIsLight, hasLabel, hasLabelContainingString } from 'lib/utils';

/*
 * This function should return the next nearest release
 * date including if the release date is today.
 * dayOfWeek: Sunday is 0, Monday is 1 etc...
 */
export function getNextMilestone({
  dayOfWeek = 4,
  startDate = new Date(),
} = {}) {
  if (startDate.getDay() === dayOfWeek) {
    return startDate;
  }
  const resultDate = new Date(startDate.getTime());
  resultDate.setDate(
    startDate.getDate() + ((7 + dayOfWeek - startDate.getDay() - 1) % 7) + 1,
  );
  return resultDate;
}

/*
 * Formats a date object into a milestone format YYYY.MM.DD
 * Handles zero filling so 2019.1.1 will be 2019.01.01
 */
export function formatDateToMilestone(date) {
  return oneLineTrim`${date.getFullYear()}-
    ${(date.getMonth() + 1).toString().padStart(2, '0')}-
    ${date.getDate().toString().padStart(2, '0')}`;
}

/*
 * Computes an object with pagination data based on starting day of week and defaulting
 * to the current date.
 *
 */
export function getMilestonePagination({
  dayOfWeek = 4,
  startDate = new Date(),
} = {}) {
  // The nearest release milestone to the starting point.
  let nextMilestone = getNextMilestone({ dayOfWeek, startDate });
  const prev = new Date(
    nextMilestone.getFullYear(),
    nextMilestone.getMonth(),
    nextMilestone.getDate() - 7,
  );

  // Set next Milestone to 7 days time if we're starting on current milestone date already.
  if (
    formatDateToMilestone(startDate) === formatDateToMilestone(nextMilestone)
  ) {
    nextMilestone = new Date(
      nextMilestone.getFullYear(),
      nextMilestone.getMonth(),
      nextMilestone.getDate() + 7,
    );
  }

  // The current milestone closest to today.
  const currentMilestone = getNextMilestone(dayOfWeek);

  return {
    // The milestone before the startDate.
    prevFromStart: formatDateToMilestone(prev),
    // The startDate milestone (might not be a typical release day).
    start: formatDateToMilestone(startDate),
    // The milestone after the startDate.
    nextFromStart: formatDateToMilestone(nextMilestone),
    // The current closest milestone to today.
    current: formatDateToMilestone(currentMilestone),
  };
}

// Set priority if there's a priority label associated with the issue.
export function setIssuePriorityProp(issue) {
  const labels = (issue.labels && issue.labels.nodes) || [];
  issue.priority = null;
  priorities.forEach((priority) => {
    if (hasLabelContainingString(labels, priority)) {
      issue.priority = priority;
    }
  });
}

// Mark contributor issues.
export function setIsContribProp(issue) {
  const labels = (issue.labels && issue.labels.nodes) || [];
  issue.isContrib = false;
  if (hasLabelContainingString(labels, 'contrib: assigned')) {
    issue.isContrib = true;
    issue.assignee = '01_contributor';
  }
}

// Set the repo name directly on the issue.
export function setRepoProp(issue) {
  if (issue.repository && issue.repository.name) {
    issue.repo = issue.repository.name;
  }
}

// Update project info,
export function setProjectProps(issue) {
  issue.hasProject = false;
  if (
    issue.projectCards &&
    issue.projectCards.nodes &&
    issue.projectCards.nodes.length
  ) {
    issue.hasProject = true;
    issue.projectUrl = issue.projectCards.nodes[0].project.url;
    issue.projectName = issue.projectCards.nodes[0].project.name;
  }
}

// Add assignee prop pointing to the login of the first assignee.
export function setAssigneeProp(issue) {
  if (!issue.isContrib) {
    issue.assignee = '00_unassigned';
    if (issue.assignees.nodes.length) {
      issue.assignee = issue.assignees.nodes[0].login;
    }
  }
}

export function setReviewerDetails(issue) {
  issue.reviewers = [];
  const reviewersListSeen = [];

  if (issue.state === 'CLOSED') {
    issue.timelineItems.edges.forEach((timelineItem) => {
      if (!timelineItem.event.source.reviews) {
        // This is not a pull request item.
        return;
      }
      const { bodyText } = timelineItem.event.source;
      const issueTestRx = new RegExp(`Fix(?:es)? #${issue.number}`, 'i');

      // Only add the review if the PR contains a `Fixes #num` or `Fix #num` line that
      // matches the original issue.
      if (issueTestRx.test(bodyText)) {
        timelineItem.event.source.reviews.edges.forEach(
          ({ review: { author } }) => {
            if (!reviewersListSeen.includes(author.login)) {
              reviewersListSeen.push(author.login);
              issue.reviewers.push({
                author,
                prLink: timelineItem.event.source.permalink,
              });
            }
          },
        );
      }
    });
  }

  // Quick and dirty way to provide a sortable key for reviewers.
  issue.reviewersNames = '';
  if (issue.reviewers.length) {
    issue.reviewersNames = issue.reviewers
      .map((review) => review.author.login)
      .join('-');
  }
}

export function setStateLabels(issue) {
  const labels = (issue.labels && issue.labels.nodes) || [];
  // Define current state of the issue.
  issue.stateLabel = issue.state.toLowerCase();
  issue.stateLabelColor =
    issue.state === 'CLOSED' ? colors.closed : colors.open;

  if (issue.state === 'OPEN' && hasLabel(labels, 'state: pull request ready')) {
    issue.stateLabel = 'PR ready';
    issue.stateLabelColor = colors.prReady;
  } else if (issue.state === 'OPEN' && hasLabel(labels, 'state: in progress')) {
    issue.stateLabel = 'in progress';
    issue.stateLabelColor = colors.inProgress;
  } else if (
    issue.state === 'CLOSED' &&
    hasLabel(labels, 'state: verified fixed')
  ) {
    issue.stateLabel = 'verified fixed';
    issue.stateLabelColor = colors.verified;
  } else if (issue.state === 'CLOSED' && hasLabel(labels, 'qa: not needed')) {
    issue.stateLabel = 'closed QA-';
    issue.stateLabelColor = colors.verified;
  }

  issue.stateLabelTextColor = colourIsLight(issue.stateLabelColor)
    ? '#000'
    : '#fff';
}

/*
 * This function massages the issue data and adds additional properties
 * to make it easier to display.
 */
export function formatIssueData(jsonData) {
  const issues = [];

  if (jsonData.data && jsonData.data.milestone_issues) {
    const issueData = jsonData.data.milestone_issues.results;

    issueData.forEach((item) => {
      // Set defaults.
      const { issue } = item;
      setIssuePriorityProp(issue);
      setIsContribProp(issue);
      setRepoProp(issue);
      setProjectProps(issue);
      setStateLabels(issue);
      setAssigneeProp(issue);
      setReviewerDetails(issue);
      issues.push(issue);
    });
  }

  return issues;
}
