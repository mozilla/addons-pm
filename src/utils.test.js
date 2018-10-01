import {
  sanitize,
} from './utils';


describe('Utils', () => {
  it('sanitize() sanitizes bad markup', () => {
    const sanitized = sanitize('<a href="javascript: alert(document.cookie)">foo</a>');
    expect(sanitized).not.toEqual(expect.stringMatching('javascript'));
  });

  it('sanitize() adds target="_blank" and rel="noopener noreferrer" to links', () => {
    const sanitized = sanitize('<a href="#whatevs">foo</a>');
    expect(sanitized).toEqual(expect.stringMatching('rel="noopener noreferrer"'));
    expect(sanitized).toEqual(expect.stringMatching('target="_blank"'));
  });
});
