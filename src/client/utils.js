import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const markdown = new MarkdownIt({
  linkify: true,
});

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

export const sanitize = DOMPurify.sanitize;
