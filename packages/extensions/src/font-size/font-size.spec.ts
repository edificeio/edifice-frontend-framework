import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { describe, expect, it } from 'vitest';
import { FontSize } from './font-size';

describe('FontSize', () => {
  const extensions = [StarterKit, TextStyle, FontSize];

  it('parses an explicit font-size from a styled span', () => {
    const json = generateJSON(
      '<p><span style="font-size: 16px;">text</span></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks).toEqual([
      expect.objectContaining({
        attrs: expect.objectContaining({ fontSize: '16px' }),
      }),
    ]);
  });

  // Pre-existing quirk (not introduced by the v3 migration, not fixed here): a styled span
  // with no font-size set parses to "" instead of the attribute's null default, because
  // parseHTML falls back to `element.style.fontSize`, which a real browser always resolves
  // to a string. See edifice-tiptap-transformer/src/models/StyleCompat.ts for the backend
  // equivalent of this bug.
  it('documents the current "" (not null) value when font-size is unset', () => {
    const json = generateJSON(
      '<p><span style="color: red;">text</span></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks[0].attrs.fontSize).toBe('');
  });
});
