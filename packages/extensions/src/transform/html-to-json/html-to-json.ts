import { Extensions, HTMLContent, generateJSON } from '@tiptap/core';

export default (html: HTMLContent, extensions: Extensions) => {
  return generateJSON(html, extensions);
};
