import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { describe, expect, it } from 'vitest';
import { LineHeight } from './line-height';

// Not currently wired into useTipTapEditor.ts, but exported and should still behave correctly.
describe('LineHeight', () => {
  const extensions = [StarterKit, TextStyle, LineHeight];

  it('parses an explicit line-height from a styled span', () => {
    const json = generateJSON(
      '<p><span style="line-height: 1.5;">text</span></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks).toEqual([
      expect.objectContaining({
        attrs: expect.objectContaining({ lineHeight: '1.5' }),
      }),
    ]);
  });

  // Same pre-existing "" vs null quirk as FontSize — see font-size.spec.ts.
  it('documents the current "" (not null) value when line-height is unset', () => {
    const json = generateJSON(
      '<p><span style="color: red;">text</span></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks[0].attrs.lineHeight).toBe('');
  });
});
