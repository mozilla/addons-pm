// Jest.setup.js
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Set __NEXT_TRAILING_SLASH to configure trailing slashes for tests
// Temp workaround for https://github.com/vercel/next.js/issues/16094
const { trailingSlash } = require('./next.config');

process.env = { ...process.env, __NEXT_TRAILING_SLASH: trailingSlash };

// Turn off console for tests.
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'debug').mockImplementation(() => jest.fn());

global.fetch = require('fetch-mock');
