/* eslint-disable no-console */
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
    const strA = a[key].toUpperCase();
    const strB = b[key].toUpperCase();
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

export function sortData({ columnKey, data, direction, sortConfig } = {}) {
  if (!data) {
    console.debug('No data yet, bailing');
    return data;
  }
  if (!Object.keys(sortConfig).includes(columnKey)) {
    console.debug(
      `"${columnKey}" does not match one of "${Object.keys(sortConfig).join(
        ', ',
      )}"`,
    );
    return data;
  }
  if (!['desc', 'asc'].includes(direction)) {
    console.debug(`"${direction}" does not match one of 'asc' or 'desc'`);
    return data;
  }

  const sortFunc = sortConfig[columnKey].sortFunc || alphaSort;
  const sorted = [].concat(data).sort(sortFunc(columnKey));

  // Reverse for desc.
  if (direction === 'desc') {
    sorted.reverse();
  }
  return sorted;
}
