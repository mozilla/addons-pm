import { oneLineTrim } from 'common-tags';

import DashCount from './DashCount';

export default function AMODashCount(props) {
  const repo = props.repo.replace(/_/g, '-');
  let warningLimit;
  let issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
    utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen`;

  if (props.title.includes('untriaged')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20-label%3A%22priority%3A%20p1%22%20
      -label%3A%22priority%3A%20p2%22%20-label%3A%22priority%3A%20p3%22%20
      -label%3A%22priority%3A%20p4%22%20-label%3A%22priority%3A%20p5%22`;
    warningLimit = 15;
  }
  if (props.title.includes('prod_bug')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22type%3A%20prod_bug%22`;
    warningLimit = 1;
  }
  if (props.title.includes('p1')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22priority:%20p1%22`;
    warningLimit = 1;
  }
  if (props.title.includes('p2')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22priority:%20p2%22`;
    warningLimit = 1;
  }
  if (props.title.includes('p3')) {
    issuesLink = oneLineTrim`https://github.com/mozilla/${repo}/issues?
      utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22priority:%20p3%22`;
    warningLimit = undefined;
  }
  if (props.title.includes('open prs')) {
    issuesLink = `https://github.com/mozilla/${repo}/pulls?q=is%3Apr+is%3Aopen`;
    warningLimit = 10;
  }

  return (
    <DashCount
      title={props.title}
      key={props.repo + props.title}
      link={issuesLink}
      warningLimit={warningLimit}
      count={props.count}
    />
  );
}
