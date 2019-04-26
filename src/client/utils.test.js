import {
  alphaSort,
  colourIsLight,
  dateSort,
  formatDateToMilestone,
  getNextMilestone,
  getMilestonePagination,
  hasLabel,
  hasLabelContainingString,
  hexToRgb,
  numericSort,
  sanitize,
} from './utils';

describe('Utils', () => {
  it('sanitize() sanitizes bad markup', () => {
    const sanitized = sanitize(
      '<a href="javascript: alert(document.cookie)">foo</a>',
    );
    expect(sanitized).not.toEqual(expect.stringMatching('javascript'));
  });

  it('sanitize() adds target="_blank" and rel="noopener noreferrer" to links', () => {
    const sanitized = sanitize('<a href="#whatevs">foo</a>');
    expect(sanitized).toEqual(
      expect.stringMatching('rel="noopener noreferrer"'),
    );
    expect(sanitized).toEqual(expect.stringMatching('target="_blank"'));
  });

  it('hexToRgb() converts hex to rgb', () => {
    const { r, g, b } = hexToRgb('#ffffff');
    expect(r).toEqual(255);
    expect(g).toEqual(255);
    expect(b).toEqual(255);
  });

  it('colourIsLight() returns useful values', () => {
    expect(colourIsLight('#ffffff')).toEqual(true);
    expect(colourIsLight('#000000')).not.toEqual(true);
  });

  describe('hasLabel()', () => {
    const fakeIssueLabels = [
      { name: 'foo' },
      { name: 'fooBar' },
      { name: 'something' },
    ];

    it('returns true for exact match', () => {
      expect(hasLabel(fakeIssueLabels, 'foo')).toEqual(true);
    });

    it('returns false for partial match', () => {
      expect(hasLabel(fakeIssueLabels, 'thing')).toEqual(false);
    });

    it('returns true for one of list input', () => {
      expect(hasLabel(fakeIssueLabels, ['foo', 'bar'])).toEqual(true);
    });

    it('returns false for partial match of list input', () => {
      expect(hasLabel(fakeIssueLabels, ['thing', 'bar'])).toEqual(false);
    });
  });

  describe('hasLabelContainingString()', () => {
    const fakeIssueLabels = [
      { name: 'foo' },
      { name: 'fooBar' },
      { name: 'bar' },
      { name: 'baz' },
      { name: 'something' },
    ];

    it('returns true for exact match', () => {
      expect(hasLabelContainingString(fakeIssueLabels, 'foo')).toEqual(true);
    });

    it('returns true for partial match', () => {
      expect(hasLabelContainingString(fakeIssueLabels, 'thing')).toEqual(true);
    });
  });

  describe('dateSort()', () => {
    const data = [
      { date: '2019-03-25T17:27:07Z' },
      { date: '2019-03-20T15:51:59Z' },
    ];

    it('sorts dates', () => {
      const result = [].concat(data).sort(dateSort('date'));
      expect(result[0]).toEqual(data[1]);
    });
  });

  describe('numericSort()', () => {
    const data = [{ num: 2 }, { num: 1 }];

    it('sorts numbers', () => {
      const result = [].concat(data).sort(numericSort('num'));
      expect(result[0]).toEqual(data[1]);
    });
  });

  describe('alphaSort()', () => {
    const data = [
      { letters: 'bbcc' },
      { letters: 'aabbcc' },
      { letters: 'cccddd' },
      { letters: 'bbcc' },
    ];

    it('sorts letters', () => {
      const result = [].concat(data).sort(alphaSort('letters'));
      expect(result[0]).toEqual(data[1]);
    });
  });

  describe('getNextMilestone()', () => {
    it('gets the next nearest Thursday', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '9');
      const nextMilestone = getNextMilestone({ startDate, dayOfWeek: 4 });
      expect(formatDateToMilestone(nextMilestone)).toEqual('2019.04.11');
    });

    it('gets the next nearest Thursday when start date is Thursday', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '11');
      const nextMilestone = getNextMilestone({ startDate, dayOfWeek: 4 });
      expect(formatDateToMilestone(nextMilestone)).toEqual('2019.04.11');
    });

    it('gets the next nearest Monday', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '11');
      const nextMilestone = getNextMilestone({ startDate, dayOfWeek: 1 });
      expect(formatDateToMilestone(nextMilestone)).toEqual('2019.04.15');
    });
  });

  describe('formatDateToMilestone()', () => {
    it('zero fills months and days', () => {
      const startDate = new Date('2019', '3', '9');
      expect(formatDateToMilestone(startDate)).toEqual('2019.04.09');
    });

    it(`doesn't zero fill months and days when not needed`, () => {
      const startDate = new Date('2019', '11', '15');
      expect(formatDateToMilestone(startDate)).toEqual('2019.12.15');
    });
  });

  describe('getMilestonePagination()', () => {
    it('gets pagination based on a specific start date', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '9');
      const milestonePagination = getMilestonePagination({
        startDate,
        dayOfWeek: 4,
      });
      expect(milestonePagination.prevFromStart).toEqual('2019.04.04');
      expect(milestonePagination.start).toEqual('2019.04.09');
      expect(milestonePagination.nextFromStart).toEqual('2019.04.11');
      expect(milestonePagination.current).toEqual(
        formatDateToMilestone(getNextMilestone()),
      );
    });

    it('gets pagination based on a specific start date that matches the dayOfWeek', () => {
      // Note months are zero indexed.
      const startDate = new Date('2019', '3', '11');
      const milestonePagination = getMilestonePagination({
        startDate,
        dayOfWeek: 4,
      });
      expect(milestonePagination.prevFromStart).toEqual('2019.04.04');
      expect(milestonePagination.start).toEqual('2019.04.11');
      expect(milestonePagination.nextFromStart).toEqual('2019.04.18');
      expect(milestonePagination.current).toEqual(
        formatDateToMilestone(getNextMilestone()),
      );
    });
  });
});
