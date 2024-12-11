import { Extensions, JSONContent, generateHTML } from '@tiptap/core';

export default (json: JSONContent, extensions: Extensions) => {
  return generateHTML(json, extensions);
};
