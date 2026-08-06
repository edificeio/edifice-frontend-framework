import { Editor } from '@tiptap/core';

import { createTestEditor } from '../test-utils/createTestEditor';

import { hasMark } from './has-mark';

describe('hasMark', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createTestEditor();
  });

  afterEach(() => {
    editor.destroy();
  });

  it('returns true for a real splittable mark from the default extension set', () => {
    expect(hasMark('bold', editor)).toBe(true);
  });

  it('returns false for a node that is not a mark', () => {
    expect(hasMark('table', editor)).toBe(false);
  });

  it('returns false without throwing when editor is null', () => {
    expect(hasMark('bold', null)).toBe(false);
  });
});
