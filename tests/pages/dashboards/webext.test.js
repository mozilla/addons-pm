/**
 * @jest-environment jsdom
 */

import { cleanup, render } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import fetchMock from 'fetch-mock';
import bzIssueCountsData from 'tests/fixtures/bz-issue-counts';
import bzNeedInfoData from 'tests/fixtures/bz-need-infos';
import bzWhiteboardTagData from 'tests/fixtures/bz-whiteboard-tags';
import DashboardWE, { getServerSideProps } from 'pages/dashboards/webext';

jest.mock('next/router', () => require('next-router-mock'));

describe(__filename, () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/bz-issue-counts\//, bzIssueCountsData);
    fetchMock.mock(/\/api\/bz-need-infos\//, bzNeedInfoData);
    fetchMock.mock(/\/api\/bz-whiteboard-tags\//, bzWhiteboardTagData);
  });

  afterEach(() => {
    fetchMock.restore();
    cleanup();
  });

  it('should render the AMO dashboard', async () => {
    mockRouter.setCurrentUrl('/dashboards/webext/');
    const { props } = await getServerSideProps();
    const { findByRole, findAllByText } = render(<DashboardWE {...props} />);
    const main = await findByRole('main');
    expect(main).toHaveClass('container');

    // All the dashgroups.
    const cardGroups = await findAllByText(/.*?/, { selector: '.card-grp' });
    expect(cardGroups).toHaveLength(4);
    // The needinfo group.
    const needInfos = await findAllByText(/.*?/, {
      selector: '.card-grp.needinfos',
    });
    expect(needInfos).toHaveLength(1);
    // The whiteboard group.
    const whiteboardTags = await findAllByText(/.*?/, {
      selector: '.card-grp.whiteboardtags',
    });
    expect(whiteboardTags).toHaveLength(1);
  });
});
