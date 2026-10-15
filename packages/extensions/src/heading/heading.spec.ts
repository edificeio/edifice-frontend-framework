import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { CustomHeading } from './heading';

describe('CustomHeading', () => {
  it("parses <h1> as customHeading, not StarterKit's bundled heading", () => {
    // v3's StarterKit bundles its own 'heading' node; it must stay disabled wherever
    // CustomHeading is used, or it silently wins the parse (see useTipTapEditor.ts).
    const extensions = [
      StarterKit.configure({ heading: false }),
      CustomHeading.configure({ levels: [1, 2] }),
    ];

    const json = generateJSON('<h1>Title</h1>', extensions);

    expect(json.content[0].type).toBe('customHeading');
  });
});
