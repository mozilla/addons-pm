/*
 * Defaulting to starting with today's date work out the current year and quarter.
 *
 */
export function getCurrentQuarter({ _date } = {}) {
  const today = _date || new Date();
  const year = today.getFullYear();
  const quarter = `Q${Math.floor((today.getMonth() + 3) / 3)}`;
  return {
    year,
    quarter,
  };
}

/*
 * Get the previous quarter and year, from starting with a quarter and year as input.
 *
 */
export function getPrevQuarter({ quarter, year } = {}) {
  if (!quarter || !year) {
    return {};
  }

  const numericQuarter = quarter.substr(1);
  let newQuarter = parseInt(numericQuarter, 10);
  let newYear = parseInt(year, 10);

  if (newQuarter > 1) {
    newQuarter = newQuarter - 1;
  } else if (newQuarter === 1) {
    newQuarter = 4;
    newYear = newYear - 1;
  }

  return {
    year: newYear,
    quarter: `Q${newQuarter}`,
  };
}

/*
 * Get the next quarter and year, starting with a quarter and year as input.
 *
 */
export function getNextQuarter({ quarter, year } = {}) {
  if (!quarter || !year) {
    return {};
  }

  const numericQuarter = quarter.substr(1);
  let newYear = parseInt(year, 10);
  let newQuarter = parseInt(numericQuarter, 10);

  if (newQuarter < 4) {
    newQuarter = newQuarter + 1;
  } else if (newQuarter === 4) {
    newQuarter = 1;
    newYear = newYear + 1;
  }

  return {
    year: newYear,
    quarter: `Q${newQuarter}`,
  };
}

/*
 * This is a universal wrapper for DOMParser
 */
export function getDOMParser() {
  if (typeof window === 'undefined' && require) {
    // eslint-disable-next-line global-require
    const { JSDOM } = require('jsdom');
    const { DOMParser } = new JSDOM().window;
    return DOMParser;
  }
  // eslint-disable-next-line no-undef
  return window.DOMParser;
}

/*
 * This function parses the specially formatted HTML we add to projects to
 * provide additional metadata about the projects.
 * This is mostly to workaround the lack of features like labels on gh projects.
 */
export function parseProjectMeta(HTML) {
  const DParser = getDOMParser();
  const parser = new DParser();
  const doc = parser.parseFromString(HTML, 'text/html');
  const engineers = doc
    .evaluate(
      "//details//dl/dt[contains(., 'Engineering')]/following-sibling::dd[1]",
      doc,
      null,
      2,
      null,
    )
    .stringValue.replace(/ ?@/g, '')
    .split(',');
  const goalType = doc
    .evaluate(
      "//details//dl/dt[contains(., 'Goal Type')]/following-sibling::dd[1]",
      doc,
      null,
      2,
      null,
    )
    .stringValue.toLowerCase();
  const size = doc.evaluate(
    "//details//dl/dt[contains(., 'Size')]/following-sibling::dd[1]",
    doc,
    null,
    2,
    null,
  ).stringValue;
  const details = doc.querySelector('details');
  if (details) {
    // Remove the meta data HTML from the doc.
    details.parentNode.removeChild(details);
  }
  return [{ engineers, goalType, size }, doc.documentElement.outerHTML];
}
