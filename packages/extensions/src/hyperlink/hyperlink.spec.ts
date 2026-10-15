import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Hyperlink } from './hyperlink';

describe('Hyperlink', () => {
  it("parses <a href> as a hyperlink mark, not StarterKit's bundled link", () => {
    // v3's StarterKit bundles its own 'link' mark; it must stay disabled wherever
    // Hyperlink is used, or it silently wins the parse (see useTipTapEditor.ts).
    const extensions = [StarterKit.configure({ link: false }), Hyperlink];

    const json = generateJSON(
      '<p><a href="https://example.com">link</a></p>',
      extensions,
    );

    const marks = json.content[0].content[0].marks;
    expect(marks).toEqual([expect.objectContaining({ type: 'hyperlink' })]);
  });
});
