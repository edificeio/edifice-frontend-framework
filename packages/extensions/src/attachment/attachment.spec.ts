import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Attachment } from './attachment';

describe('Attachment', () => {
  const extensions = [StarterKit, Attachment];

  it('parses the attached links, falling back to the href for the document id', () => {
    const html =
      '<div class="attachments"><a href="/workspace/document/123" data-content-type="application/pdf">file.pdf</a></div>';

    const json = generateJSON(html, extensions);

    expect(json.content[0]).toMatchObject({
      type: 'attachments',
      attrs: {
        links: [
          {
            href: '/workspace/document/123',
            name: 'file.pdf',
            dataDocumentId: '123',
            dataContentType: 'application/pdf',
          },
        ],
      },
    });
  });

  it('renders the links back as <a> tags inside the attachments div', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'attachments',
          attrs: {
            links: [
              {
                href: '/workspace/document/123',
                name: 'file.pdf',
                dataDocumentId: '123',
                dataContentType: 'application/pdf',
              },
            ],
          },
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('<div class="attachments">');
    expect(html).toContain('href="/workspace/document/123"');
    expect(html).toContain('data-document-id="123"');
  });
});
