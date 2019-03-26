import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { goodFirstBugs } from './fixtures/goodFirstBugs';
import { maybeGoodFirstBugs } from './fixtures/maybeGoodFirstBugs';
import { issueCounts } from './fixtures/issueCounts';
import { team } from './fixtures/team';
import { projects } from './fixtures/projects';

Enzyme.configure({ adapter: new Adapter() });

global.fetch = require('fetch-mock');
global.requestAnimationFrame = function(callback) {
  window.setTimeout(callback, 0);
};

global.testData = {
  goodFirstBugs,
  maybeGoodFirstBugs,
  issueCounts,
  team,
  projects,
};
