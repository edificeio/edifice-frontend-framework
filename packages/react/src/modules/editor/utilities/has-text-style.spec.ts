import { Editor } from '@tiptap/core';
import TextStyle from '@tiptap/extension-text-style';

import { createTestEditor } from '../test-utils/createTestEditor';

import { hasTextStyle } from './has-text-style';

describe('hasTextStyle', () => {
  describe('with the default editor (no TextStyle extension)', () => {
    let editor: Editor;

    beforeEach(() => {
      editor = createTestEditor();
    });

    afterEach(() => {
      editor.destroy();
    });

    it('returns falsy regardless of the style name', () => {
      expect(hasTextStyle('textStyle', editor)).toBeFalsy();
    });

    it('returns falsy without throwing when editor is null', () => {
      expect(hasTextStyle('textStyle', null)).toBeFalsy();
    });
  });

  describe('with a custom editor including TextStyle', () => {
    let editor: Editor;

    beforeEach(() => {
      editor = createTestEditor({ extensions: [TextStyle] });
    });

    afterEach(() => {
      editor.destroy();
    });

    it('returns the found extension when the style name matches', () => {
      expect(hasTextStyle('textStyle', editor)).toBeTruthy();
    });

    it('returns undefined when the style name does not match any extension', () => {
      expect(hasTextStyle('nonexistent', editor)).toBeUndefined();
    });
  });
});
