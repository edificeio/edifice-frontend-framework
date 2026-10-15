import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Paragraph } from './paragraph';

// Not currently wired into useTipTapEditor.ts, but exported to read legacy (v0) content.
describe('Paragraph', () => {
  it('parses the legacy div[style]:has(> span) shape as a paragraph', () => {
    const extensions = [StarterKit.configure({ paragraph: false }), Paragraph];

    const html =
      '<div style="text-align: right;"><span>A right-aligned text</span></div>';
    const json = generateJSON(html, extensions);

    expect(json.content[0].type).toBe('paragraph');
  });

  it('still parses a plain <p> (current format)', () => {
    const extensions = [StarterKit.configure({ paragraph: false }), Paragraph];

    const json = generateJSON('<p>Hello</p>', extensions);

    expect(json.content[0].type).toBe('paragraph');
  });
});
