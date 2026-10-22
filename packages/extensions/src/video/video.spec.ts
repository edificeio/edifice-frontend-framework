import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Video } from './video';

describe('Video', () => {
  const extensions = [StarterKit, Video];

  it('parses a bare <video controls> as controls: true', () => {
    const json = generateJSON(
      '<div class="video-wrapper"><video src="/a.mp4" controls></video></div>',
      extensions,
    );

    expect(json.content[0]).toMatchObject({
      type: 'video',
      attrs: { src: '/a.mp4', controls: true },
    });
  });

  // Surprising but current behavior: controls="true" (an explicit value) is read as the
  // literal string "true", not the boolean true — only a bare `controls` attribute
  // produces a real boolean, via a separate code path (parseHTML's getAttribute/
  // hasAttribute branches).
  it('parses controls="true" as the string "true", not a boolean', () => {
    const json = generateJSON(
      '<div class="video-wrapper"><video src="/a.mp4" controls="true"></video></div>',
      extensions,
    );

    expect(json.content[0].attrs.controls).toBe('true');
  });

  it('defaults controls to false when the attribute is absent', () => {
    const json = generateJSON(
      '<div class="video-wrapper"><video src="/a.mp4"></video></div>',
      extensions,
    );

    expect(json.content[0].attrs.controls).toBe(false);
  });

  it('parses the captation flag from data-document-is-captation', () => {
    const json = generateJSON(
      '<div class="video-wrapper"><video src="/a.mp4" data-document-is-captation="true"></video></div>',
      extensions,
    );

    expect(json.content[0].attrs.isCaptation).toBe('true');
  });

  it('renders back wrapped in a div.video-wrapper', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'video',
          attrs: { src: '/a.mp4', controls: true },
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('<div class="video-wrapper">');
    expect(html).toContain('<video');
  });
});
