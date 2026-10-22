import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Alert } from './alert';

describe('Alert', () => {
  const extensions = [StarterKit, Alert];

  it.each([
    ['<p class="info">Info</p>', 'info'],
    ['<p class="warning">Warning</p>', 'warning'],
    ['<div class="info">Info</div>', 'info'],
    ['<div class="warning">Warning</div>', 'warning'],
  ])('parses legacy "%s" as an alert node', (html, expectedClass) => {
    const json = generateJSON(html, extensions);

    expect(json.content[0]).toMatchObject({
      type: 'alert',
      attrs: { class: expectedClass },
    });
  });

  it('renders back to a <div> with the class attribute', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'alert',
          attrs: { class: 'warning' },
          content: [{ type: 'text', text: 'Warning' }],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toBe('<div class="warning">Warning</div>');
  });
});
