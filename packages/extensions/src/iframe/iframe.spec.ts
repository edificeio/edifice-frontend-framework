import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Iframe } from './iframe';

describe('Iframe', () => {
  const extensions = [StarterKit, Iframe];

  it('parses src, width and style', () => {
    const json = generateJSON(
      '<iframe src="https://example.com" width="400" style="border: 0;"></iframe>',
      extensions,
    );

    expect(json.content[0]).toMatchObject({
      type: 'iframe',
      attrs: { src: 'https://example.com', width: '400' },
    });
  });

  it('always reports allowfullscreen regardless of the source HTML (extension default)', () => {
    const json = generateJSON(
      '<iframe src="https://example.com"></iframe>',
      extensions,
    );

    expect(json.content[0].attrs.allowfullscreen).toBe(true);
  });

  it('renders width as "100%" unchanged, but coerces a numeric width to a number', () => {
    const attrs = (width: string) => ({ src: 'https://example.com', width });
    const percentHtml = generateHTML(
      { type: 'doc', content: [{ type: 'iframe', attrs: attrs('100%') }] },
      extensions,
    );
    const numericHtml = generateHTML(
      { type: 'doc', content: [{ type: 'iframe', attrs: attrs('400') }] },
      extensions,
    );

    expect(percentHtml).toContain('width="100%"');
    expect(numericHtml).toContain('width="400"');
  });
});
