import { H5P } from '@edifice.io/tiptap-extensions/h5p';
import { Editor } from '@tiptap/core';
import { createTestEditor } from '../../test-utils/createTestEditor';

const CONTENT_ID = '0b8c2a4e-6f1d-4c3b-9a7e-2d5f8e1c0a93';
const STORED = `<div class="h5p-activity" data-h5p-id="${CONTENT_ID}"><a href="/h5p/embed/${CONTENT_ID}" target="_blank" rel="noopener">Activité interactive</a></div>`;

describe('H5P', () => {
  let editor: Editor;

  afterEach(() => editor?.destroy());

  it('keeps the activity through an HTML round trip', () => {
    editor = createTestEditor({ extensions: [H5P], content: STORED });

    expect(editor.getJSON().content?.[0]).toMatchObject({
      type: 'h5p',
      attrs: { contentId: CONTENT_ID },
    });
    expect(editor.getHTML()).toBe(STORED);
  });

  it('regenerates the fallback link and drops foreign attributes', () => {
    editor = createTestEditor({
      extensions: [H5P],
      content: `<div data-h5p-id="${CONTENT_ID}" onclick="alert(1)" data-src="https://evil.example"><a href="javascript:alert(1)">x</a></div>`,
    });

    expect(editor.getHTML()).toBe(STORED);
  });

  it('ignores an id that is not a UUID', () => {
    editor = createTestEditor({
      extensions: [H5P],
      content: '<div data-h5p-id="../../admin">texte</div>',
    });

    expect(editor.getJSON().content?.some((n) => n.type === 'h5p')).toBe(false);
  });

  it('inserts an activity by command, only with a UUID', () => {
    editor = createTestEditor({ extensions: [H5P] });

    expect(editor.commands.insertH5P({ contentId: 'pas-un-uuid' })).toBe(false);
    expect(editor.commands.insertH5P({ contentId: CONTENT_ID })).toBe(true);
    expect(editor.getHTML()).toContain(`data-h5p-id="${CONTENT_ID}"`);
  });
});
