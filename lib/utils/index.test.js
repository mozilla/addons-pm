import {
  colourIsLight,
  hasLabel,
  hasLabelContainingString,
  hexToRgb,
  sanitize,
} from 'lib/utils';

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
});
