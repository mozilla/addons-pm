import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { goodFirstBugs } from './fixtures/goodFirstBugs';
import { issueCounts } from './fixtures/issueCounts';
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
  contribWelcome,
  goodFirstBugs,
  issueCounts,
  maybeGoodFirstBugs,
  milestoneIssues,
  projects,
  team,
};
