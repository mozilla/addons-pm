import { fetchIssueCount } from 'lib/bzapi';
import { bugzilla } from 'lib/const';

export default async (req, res) => {
  const requests = [];
  const combinedData = {};

  for (const product of bugzilla.products) {
    combinedData[product] = {};

    for (const priority of bugzilla.priorities) {
      requests.push(
        fetchIssueCount({
          product,
          priority,
          bug_severity: null,
        }).then((result) => {
          let priorityLabel;
          switch (priority) {
            case '--':
              priorityLabel = 'default';
              break;
            default:
              priorityLabel = priority.toLowerCase();
          }
          combinedData[product][`priority-${priorityLabel}`] = result;
        }),
      );
    }

    for (const bug_severity of bugzilla.severities) {
      requests.push(
        fetchIssueCount({
          product,
          bug_severity,
          priority: null,
        }).then((result) => {
          let severityLabel;
          switch (bug_severity) {
            case 'N/A':
              severityLabel = 'not-applicable';
              break;
            case '--':
              severityLabel = 'default';
              break;
            default:
              severityLabel = bug_severity.toLowerCase();
          }
          combinedData[product][`severity-${severityLabel}`] = result;
        }),
      );
    }

    requests.push(
      fetchIssueCount({
        product,
        bug_severity: null,
        priority: null,
      }).then((result) => {
        combinedData[product].total = result;
      }),
    );
  }

  return Promise.all(requests).then(() => {
    res.json(combinedData);
  });
};
