import { Editor } from '@tiptap/core';
import { Slice } from '@tiptap/pm/model';
import StarterKit from '@tiptap/starter-kit';

import ImageNodeView from './ImageNodeView';

const Stub = () => null;

let editors: Editor[] = [];

function makeEditor(...args: Parameters<typeof ImageNodeView>) {
  const editor = new Editor({
    extensions: [StarterKit, ImageNodeView(...args)],
  });
  editors.push(editor);
  return editor;
}

const pastePlugins = (editor: Editor) =>
  editor.state.plugins.filter(({ props }) => props.handlePaste).length;

// A clipboard holding a single file, without text or HTML.
const pasteOf = (file: File) =>
  ({
    clipboardData: { files: [file], getData: () => '' },
  }) as unknown as ClipboardEvent;

afterEach(() => {
  editors.forEach((editor) => editor.destroy());
  editors = [];
});

describe('ImageNodeView', () => {
  it('adds the plugin uploading pasted or dropped images when given an uploader', () => {
    expect(pastePlugins(makeEditor(Stub, vi.fn()))).toBe(
      pastePlugins(makeEditor(Stub)) + 1,
    );
  });

  it('leaves a pasted image to the default handling without an uploader', () => {
    const editor = makeEditor(Stub);
    const image = new File(['png'], 'photo.png', { type: 'image/png' });

    const handled = editor.view.someProp('handlePaste', (handlePaste) =>
      handlePaste(editor.view, pasteOf(image), Slice.empty),
    );

    expect(handled).toBeFalsy();
    expect(editor.getHTML()).toBe('<p></p>');
  });
});
