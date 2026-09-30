import { Editor } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
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

  describe('commands', () => {
    let editor: Editor | undefined;

    afterEach(() => {
      editor?.destroy();
    });

    it('setImage() (inherited from TiptapImage) inserts a custom-image node', () => {
      // Regression: addCommands() must spread ...this.parent?.() or this
      // throws "setImage is not a function" (same bug class as heading.ts).
      editor = new Editor({ extensions, content: '<p></p>' });

      editor.commands.setImage({ src: '/workspace/document/42' });

      const image = editor.getJSON().content?.[0]?.content?.[0];
      expect(image).toMatchObject({
        type: 'custom-image',
        attrs: { src: '/workspace/document/42' },
      });
    });

    it('setNewImage() replaces the current selection with a custom-image node', () => {
      editor = new Editor({ extensions, content: '<p></p>' });

      editor.commands.setNewImage({ src: '/workspace/document/7' });

      const image = editor.getJSON().content?.[0]?.content?.[0];
      expect(image).toMatchObject({
        type: 'custom-image',
        attrs: { src: '/workspace/document/7' },
      });
    });
  });
});
