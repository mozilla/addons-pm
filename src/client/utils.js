import { oneLineTrim } from 'common-tags';
import DOMPurify from 'dompurify';

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Polyfill padStart if it's not available.
if (!String.prototype.padStart) {
  console.log('Polyfilling padStart');
  /* eslint-disable-next-line no-extend-native */
  String.prototype.padStart = function(length, repeated) {
    return repeated.repeat(length).substring(0, length - this.length) + this;
  };
}

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

export function dateSort(key) {
  return (a, b) => {
    return new Date(a[key]) - new Date(b[key]);
  };
}

export function numericSort(key) {
  return (a, b) => {
    return a[key] - b[key];
  };
}

export function alphaSort(key) {
  return (a, b) => {
    var strA = a[key].toUpperCase();
    var strB = b[key].toUpperCase();
    if (strA < strB) {
      return -1;
    }
    if (strA > strB) {
      return 1;
    }
    // names must be equal
    return 0;
  };
}

// This function should return the next nearest release
// date including if the release date is today.
// dayOfWeek: Sunday is 0, Monday is 1 etc...
export function getNextMilestone({
  dayOfWeek = 4,
  startDate = new Date(),
} = {}) {
  if (startDate.getDay() === dayOfWeek) {
    return startDate;
  }
  const resultDate = new Date(startDate.getTime());
  resultDate.setDate(
    startDate.getDate() + ((7 + dayOfWeek - startDate.getDay() - 1) % 7) + 1,
  );
  return resultDate;
}

// Formats a date object into a milestone format YYYY.MM.DD
// Handles zero filling so 2019.1.1 will be 2019.01.01
export function formatDateToMilestone(date) {
  return oneLineTrim`${date.getFullYear()}.
    ${(date.getMonth() + 1).toString().padStart(2, '0')}.
    ${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
}

export function getMilestonePagination({
  dayOfWeek = 4,
  startDate = new Date(),
} = {}) {
  // The nearest release milestone to the starting point.
  let nextMilestone = getNextMilestone({ dayOfWeek, startDate });
  const prev = new Date(
    nextMilestone.getFullYear(),
    nextMilestone.getMonth(),
    nextMilestone.getDate() - 7,
  );

  // Set next Milestone to 7 days time if we're starting on current milestone date already.
  if (
    formatDateToMilestone(startDate) === formatDateToMilestone(nextMilestone)
  ) {
    nextMilestone = new Date(
      nextMilestone.getFullYear(),
      nextMilestone.getMonth(),
      nextMilestone.getDate() + 7,
    );
  }

  // The current milestone closest to today.
  const currentMilestone = getNextMilestone(dayOfWeek);

  return {
    // The milestone before the startDate.
    prevFromStart: formatDateToMilestone(prev),
    // The startDate milestone (might not be a typical release day).
    start: formatDateToMilestone(startDate),
    // The milestone after the startDate.
    nextFromStart: formatDateToMilestone(nextMilestone),
    // The current closest milestone to today.
    current: formatDateToMilestone(currentMilestone),
  };
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
  var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return a < 0.5;
}

export const sanitize = DOMPurify.sanitize;
