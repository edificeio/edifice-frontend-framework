import { Editor } from '@tiptap/core';
import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { CustomHighlight } from './highlight';

describe('CustomHighlight', () => {
  const extensions = [StarterKit, CustomHighlight];

  it('parses a background-color style into the color attribute', () => {
    const json = generateJSON(
      '<p><span style="background-color: yellow;">Highlighted</span></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks).toEqual([
      expect.objectContaining({
        type: 'customHighlight',
        attrs: expect.objectContaining({ color: 'yellow' }),
      }),
    ]);
  });

  it('renders the color attribute back as a background-color style', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Highlighted',
              marks: [{ type: 'customHighlight', attrs: { color: 'yellow' } }],
            },
          ],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('background-color: yellow');
  });

  describe('commands', () => {
    let editor: Editor | undefined;

    afterEach(() => {
      editor?.destroy();
    });

    // CustomHighlight renames the mark ('customHighlight' instead of
    // 'highlight') but doesn't override addCommands(), so setHighlight/
    // toggleHighlight/unsetHighlight are inherited as-is from
    // @tiptap/extension-highlight - confirm they're actually callable and
    // correctly scoped to 'customHighlight', not just present in the types.
    it('setHighlight()/unsetHighlight() (inherited) apply and remove the mark', () => {
      editor = new Editor({
        extensions,
        content: '<p>Some text</p>',
      });

      editor.commands.selectAll();
      editor.commands.setHighlight({ color: 'yellow' });

      expect(editor.getJSON().content?.[0]?.content?.[0]?.marks).toEqual([
        expect.objectContaining({
          type: 'customHighlight',
          attrs: expect.objectContaining({ color: 'yellow' }),
        }),
      ]);

      editor.commands.unsetHighlight();

      expect(
        editor.getJSON().content?.[0]?.content?.[0]?.marks,
      ).toBeUndefined();
    });
  });
});
