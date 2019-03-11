import React from 'react';
import { Card } from 'react-bootstrap';

import DashCount from './DashCount';

export default function DashCountGroup(props) {
  function renderDashCounts() {
    const { repo, issueCounts } = props;
    const counts = [];
    counts.push(
      DashCount({
        title: 'total open issues',
        count: issueCounts.total_issues.totalCount,
        repo,
      }),
    );

    counts.push(
      DashCount({
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
          DashCount({
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
    <div className="card-grp" key={props.repo}>
      <Card bg="dark" text="white" className="repo-card">
        <Card.Header>{props.repo.replace(/_/g, ' ').toUpperCase()}</Card.Header>
        <Card.Body>
          <Card.Text>{props.description}</Card.Text>
        </Card.Body>
      </Card>
      {renderDashCounts()}
    </div>
  );
}
