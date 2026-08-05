import { Editor } from '@tiptap/core';

import { createTestEditor } from '../test-utils/createTestEditor';

import { hasExtension } from './has-extension';

describe('hasExtension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createTestEditor();
  });

  afterEach(() => {
    editor.destroy();
  });

  it('returns true when the extension is present in the editor', () => {
    expect(hasExtension('table', editor)).toBe(true);
  });

  it('returns true for a StarterKit extension like bold', () => {
    expect(hasExtension('bold', editor)).toBe(true);
  });

  it('returns true for underline', () => {
    expect(hasExtension('underline', editor)).toBe(true);
  });

  it('returns false when the extension is not present in the editor', () => {
    expect(hasExtension('mathematics', editor)).toBe(false);
  });

  it('returns false without throwing when editor is null', () => {
    expect(hasExtension('table', null)).toBe(false);
  });
});
