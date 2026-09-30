import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { Image } from './image';

describe('Image (custom-image)', () => {
  const extensions = [StarterKit, Image];

  // custom-image is inline, so the parser wraps it in an implicit paragraph.
  const firstImage = (html: string) =>
    generateJSON(html, extensions).content[0].content[0];

  it('parses a plain <img> with its attributes', () => {
    const image = firstImage(
      '<img src="/workspace/document/123" alt="desc" title="t" width="100" height="50">',
    );

    expect(image).toMatchObject({
      type: 'custom-image',
      attrs: {
        src: '/workspace/document/123',
        alt: 'desc',
        title: 't',
        width: '100',
        height: '50',
      },
    });
  });

  it('ignores data: URIs (not a stored document image)', () => {
    const json = generateJSON(
      '<img src="data:image/png;base64,abc">',
      extensions,
    );

    expect(json.content[0]?.content?.[0]?.type).not.toBe('custom-image');
  });

  it('inherits width from the legacy image-container wrapper', () => {
    const html =
      '<div class="image-container" style="width: 200px;"><img src="/x.jpg"></div>';

    expect(firstImage(html).attrs.width).toBe('200px');
  });

  it('recognizes a legacy smiley image by filename and resets its width/height', () => {
    const image = firstImage('<img src="/images/happy.png">');

    expect(image).toMatchObject({
      type: 'custom-image',
      attrs: { width: 'null', height: 'null' },
    });
    expect(image.attrs.style).toEqual({
      width: '1.5em',
      height: '1.5em',
      fontSize: '16px',
    });
  });
});
