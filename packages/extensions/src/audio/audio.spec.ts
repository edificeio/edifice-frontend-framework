import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Audio } from './audio';

describe('Audio', () => {
  const extensions = [StarterKit, Audio];

  it('parses src and documentId', () => {
    const json = generateJSON(
      '<div class="audio-wrapper"><audio src="/a.mp3" data-document-id="123"></audio></div>',
      extensions,
    );

    expect(json.content[0]).toMatchObject({
      type: 'audio',
      attrs: { src: '/a.mp3', documentId: '123' },
    });
  });

  it('renders back wrapped in a div.audio-wrapper', () => {
    const json = {
      type: 'doc',
      content: [{ type: 'audio', attrs: { src: '/a.mp3' } }],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('<div class="audio-wrapper">');
    expect(html).toContain('<audio');
  });
});
