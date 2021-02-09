import DOMPurifyLib from 'dompurify';
import queryString from 'query-string';

// Create an DOMPurify instance in a universal way.
let DOMPurify;
if (typeof window === 'undefined') {
  // eslint-disable-next-line global-require
  const { JSDOM } = require('jsdom');
  const { window } = new JSDOM('<!DOCTYPE html>');
  DOMPurify = DOMPurifyLib(window);
} else {
  DOMPurify = DOMPurifyLib;
}

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const { sanitize } = DOMPurify;

export function hasLabel(issueLabels, labelOrLabelList) {
  const labels = issueLabels || [];
  if (Array.isArray(labelOrLabelList)) {
    return labels.some((item) => labelOrLabelList.includes(item.name));
  }
  return !!labels.find((label) => label.name === labelOrLabelList);
}

export function hasLabelContainingString(issueLabels, string) {
  const labels = issueLabels || [];
  const rx = new RegExp(string);
  return !!labels.find((label) => rx.test(label.name));
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {};
}

export function colourIsLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Counting the perceptive luminance
  // human eye favors green color...
  const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return a < 0.5;
}

export function getApiURL(path, queryParams) {
  if (!path.startsWith('/api')) {
    throw new Error(`Path should start with '/api'`);
  }
  const host = process.env.API_HOST || '';
  let apiUrl = `${host}${path}`;
  if (queryParams) {
    apiUrl = `${apiUrl}?${queryString.stringify(queryParams)}`;
  }
  return apiUrl;
}
