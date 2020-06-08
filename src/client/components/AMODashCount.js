import React from 'react';
import { oneLineTrim } from 'common-tags';

import DashCount from './DashCount';

export default function AMODashCount(props) {
  const repo = props.repo.replace(/_/g, '-');
  let warning = false;
  let issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
    utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen`;

  if (props.title.includes('total open issues')) {
  }
  if (props.title.includes('untriaged')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20-label%3A%22priority%3A%20p1%22%20
      -label%3A%22priority%3A%20p2%22%20-label%3A%22priority%3A%20p3%22%20
      -label%3A%22priority%3A%20p4%22%20-label%3A%22priority%3A%20p5%22`;

    if (props.count > 15) {
      warning = true;
    }
  }
  if (props.title.includes('p1')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22priority:%20p1%22`;
    if (props.count > 0) {
      warning = true;
    }
  }
  if (props.title.includes('p2')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22priority:%20p2%22`;
    if (props.count > 0) {
      warning = true;
    }
  }
  if (props.title.includes('open prs')) {
    issuesLink = `https://github.com/mozilla/${repo}/pulls?q=is%3Apr+is%3Aopen`;
    if (props.count > 10) {
      warning = true;
    }
  }

  return (
    <DashCount
      title={props.title}
      key={props.repo + props.title}
      link={issuesLink}
      warning={warning}
      count={props.count}
    />
  );
}
