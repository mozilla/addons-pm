import { hasLabelContainingString } from 'lib/utils';
import { priorities } from 'lib/const';

export function formatContribData(data) {
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
