import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.fetch = require('fetch-mock');
global.requestAnimationFrame = function(callback) {
  window.setTimeout(callback, 0);
};
