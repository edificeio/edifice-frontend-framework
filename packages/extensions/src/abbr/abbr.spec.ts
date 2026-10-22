import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Abbr } from './abbr';

describe('Abbr', () => {
  const extensions = [StarterKit, Abbr];

  it('parses <abbr> as an abbr mark', () => {
    const json = generateJSON('<p><abbr>HTML</abbr></p>', extensions);

    const marks = json.content[0].content[0].marks;
    expect(marks).toEqual([expect.objectContaining({ type: 'abbr' })]);
  });

  it('renders the mark back to <abbr>', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'HTML', marks: [{ type: 'abbr' }] }],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toBe('<p><abbr>HTML</abbr></p>');
  });
});
