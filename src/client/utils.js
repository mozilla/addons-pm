import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if ('target' in node) {
    node.setAttribute('target','_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const markdown = new MarkdownIt({
  linkify: true,
});

export const sanitize = DOMPurify.sanitize;
