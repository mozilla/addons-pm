import React from 'react';
import AMODashCount from './AMODashCount';
import DashCountGroup from './DashCountGroup';

export default function AMODashCountGroup(props) {
  function renderDashCounts() {
    const { repo, issueCounts } = props;
    const counts = [];
    counts.push(
      AMODashCount({
        title: 'total open issues',
        count: issueCounts.total_issues.totalCount,
        repo,
      }),
    );

    counts.push(
      AMODashCount({
        title: 'untriaged issues',
        count:
          issueCounts.total_issues.totalCount - issueCounts.triaged.totalCount,
        repo,
      }),
    );

    Object.keys(issueCounts).forEach((count, index) => {
      const totalCount = issueCounts[count].totalCount;
      const title = count.replace('_', ' ');
      if (
        !count.startsWith('__') &&
        count !== 'total_issues' &&
        count !== 'triaged' &&
        count !== 'description'
      ) {
        counts.push(
          AMODashCount({
            title,
            count: totalCount,
            repo,
          }),
        );
      }
    });
    return counts;
  }

  return (
    <DashCountGroup
      title={props.repo.replace(/_/g, ' ').toUpperCase()}
      description={props.description}
    >
      {renderDashCounts()}
    </DashCountGroup>
  );
}
