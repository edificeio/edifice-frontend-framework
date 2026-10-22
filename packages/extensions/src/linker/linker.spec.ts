import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Linker } from './linker';

describe('Linker', () => {
  // v3's StarterKit bundles its own 'link' mark, which would win the parse instead of
  // Linker below (confirmed) — same mechanism as Hyperlink, see hyperlink.spec.ts and
  // useTipTapEditor.ts, which already disables it in production.
  const extensions = [StarterKit.configure({ link: false }), Linker];

  it('parses a link with data-id and data-app-prefix as a linker node', () => {
    const html =
      '<p><a href="/blog#/view/35fa4198/5e654c71" data-id="35fa4198" data-app-prefix="blog">Blog post</a></p>';

    const json = generateJSON(html, extensions);

    expect(json.content[0].content[0]).toMatchObject({
      type: 'linker',
      attrs: { 'data-id': '35fa4198', 'data-app-prefix': 'blog' },
    });
  });

  it('does not match a plain link without data-id/data-app-prefix', () => {
    const html = '<p><a href="https://example.com">link</a></p>';

    const json = generateJSON(html, extensions);

    expect(json.content[0].content[0].type).not.toBe('linker');
  });

  it('sanitizes a javascript: href on render', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'linker',
          attrs: {
            'href': 'javascript:alert(1)',
            'data-id': '1',
            'data-app-prefix': 'blog',
          },
          content: [{ type: 'text', text: 'click' }],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('href=""');
  });
});
