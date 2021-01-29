import React from 'react';
import { render } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import bzIssueCountsData from 'fixtures/bz-issue-counts';
import bzNeedInfoData from 'fixtures/bz-need-infos';

import DashboardWE from './webext';

const fakeLocation = {
  pathname: '/dashboards/webext/',
};

describe('Webext Dashboard', () => {
  beforeEach(() => {
    fetchMock.mock(/\/api\/bz-issue-counts\//, bzIssueCountsData);
    fetchMock.mock(/\/api\/bz-need-infos\//, bzNeedInfoData);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render the webextension dashboard groups', async () => {
    const { findAllByText } = render(<DashboardWE location={fakeLocation} />);

    // All the dashgroups.
    const cardGroups = await findAllByText(/.*?/, { selector: '.card-grp' });
    expect(cardGroups).toHaveLength(4);
    // The needinfo group.
    const needInfos = await findAllByText(/.*?/, {
      selector: '.card-grp.needinfos',
    });
    expect(needInfos).toHaveLength(1);
  });
});
