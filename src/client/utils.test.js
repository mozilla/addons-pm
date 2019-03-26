import {
  dateSort,
  numericSort,
  alphaSort,
  sanitize,
  hasLabel,
  hasLabelContainingString,
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
    const data = [{ letters: 'bbcc' }, { letters: 'aabbcc' }];

    it('sorts letters', () => {
      const result = [].concat(data).sort(alphaSort('letters'));
      expect(result[0]).toEqual(data[1]);
    });
  });
});
