import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
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
});
