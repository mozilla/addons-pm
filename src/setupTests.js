import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { goodFirstBugs } from './fixtures/goodFirstBugs';
import { githubIssueCounts } from './fixtures/githubIssueCounts';
import { bugzillaIssueCounts } from './fixtures/bugzillaIssueCounts';
import { bugzillaIssueCountsLocal } from './fixtures/bugzillaIssueCountsLocal';
import { bugzillaNeedsInfoLocal } from './fixtures/bugzillaNeedsInfoLocal';
import { maybeGoodFirstBugs } from './fixtures/maybeGoodFirstBugs';
import { milestoneIssues } from './fixtures/milestoneIssues';
import { projects } from './fixtures/projects';
import { team } from './fixtures/team';
import { contribWelcome } from './fixtures/contribWelcome';

Enzyme.configure({ adapter: new Adapter() });

global.fetch = require('fetch-mock');
global.requestAnimationFrame = function (callback) {
  window.setTimeout(callback, 0);
};

global.scrollTo = function () {};

global.testData = {
  bugzillaIssueCounts,
  bugzillaIssueCountsLocal,
  bugzillaNeedsInfoLocal,
  contribWelcome,
  goodFirstBugs,
  githubIssueCounts,
  maybeGoodFirstBugs,
  milestoneIssues,
  projects,
  team,
};

// Turn off console for tests.
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
