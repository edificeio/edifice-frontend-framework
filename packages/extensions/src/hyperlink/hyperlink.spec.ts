import { Editor } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { Hyperlink } from './hyperlink';

describe('Hyperlink', () => {
  const extensions = [StarterKit.configure({ link: false }), Hyperlink];

  it("parses <a href> as a hyperlink mark, not StarterKit's bundled link", () => {
    // v3's StarterKit bundles its own 'link' mark; it must stay disabled wherever
    // Hyperlink is used, or it silently wins the parse (see useTipTapEditor.ts).
    const json = generateJSON(
      '<p><a href="https://example.com">link</a></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks).toEqual([expect.objectContaining({ type: 'hyperlink' })]);
  });

  describe('commands', () => {
    let editor: Editor | undefined;

    afterEach(() => {
      editor?.destroy();
    });

    // Hyperlink renames the mark ('hyperlink' instead of 'link') but doesn't
    // override addCommands(), so setLink/unsetLink are inherited as-is from
    // @tiptap/extension-link - confirm they're actually callable and
    // correctly scoped to 'hyperlink', not just present in the types.
    it('setLink()/unsetLink() (inherited) apply and remove the mark', () => {
      editor = new Editor({ extensions, content: '<p>Some text</p>' });

      editor.commands.selectAll();
      editor.commands.setLink({ href: 'https://example.com' });

      expect(editor.getJSON().content?.[0]?.content?.[0]?.marks).toEqual([
        expect.objectContaining({
          type: 'hyperlink',
          attrs: expect.objectContaining({ href: 'https://example.com' }),
        }),
      ]);

      editor.commands.unsetLink();

      expect(
        editor.getJSON().content?.[0]?.content?.[0]?.marks,
      ).toBeUndefined();
    });
  });
});
