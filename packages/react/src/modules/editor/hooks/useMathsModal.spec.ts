import Mathematics from '@tiptap/extension-mathematics';
import { Editor } from '@tiptap/react';
import { act, renderHook } from '~/setup';
import { createTestEditor } from '../test-utils/createTestEditor';
import { useMathsModal } from './useMathsModal';

function buildEditor(content = '<p>Hello</p>') {
  return createTestEditor({ content, extensions: [Mathematics] });
}

describe('useMathsModal', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('starts closed', () => {
    editor = buildEditor();
    const { result } = renderHook(() => useMathsModal(editor));

    expect(result.current.isOpen).toBe(false);
  });

  it('toggle opens and closes the modal', () => {
    editor = buildEditor();
    const { result } = renderHook(() => useMathsModal(editor));

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('onCancel closes the modal without touching the editor content', () => {
    editor = buildEditor();
    const { result } = renderHook(() => useMathsModal(editor));
    act(() => result.current.toggle());

    act(() => result.current.onCancel());

    expect(result.current.isOpen).toBe(false);
    expect(editor.getText()).toBe('Hello');
  });

  it('onSuccess inserts a real inlineMath node (not literal $...$ text)', () => {
    // Regression: inserting a raw `$...$` string never produced a math node -
    // TipTap's input rules only convert that syntax on live keystrokes, never
    // on a programmatic insertion like this one.
    editor = buildEditor();
    editor.commands.setTextSelection(editor.state.doc.content.size);
    const { result } = renderHook(() => useMathsModal(editor));

    act(() => result.current.onSuccess('E=mc^2'));

    expect(editor.getJSON().content?.[0]).toMatchObject({
      content: [
        { type: 'text', text: 'Hello' },
        { type: 'inlineMath', attrs: { latex: 'E=mc^2' } },
      ],
    });
  });

  it('onSuccess inserts a multi-line latex string as a single node attribute', () => {
    // The old `$<br/>$`-splicing workaround (now removed - see MathsModal)
    // chopped a multi-line formula into several nodes; a single JSON node
    // with an embedded newline in its `latex` attr is structurally valid and
    // keeps the whole formula as one equation.
    editor = buildEditor();
    editor.commands.setTextSelection(editor.state.doc.content.size);
    const { result } = renderHook(() => useMathsModal(editor));

    act(() => result.current.onSuccess('a\nb'));

    expect(editor.getJSON().content?.[0]).toMatchObject({
      content: [
        { type: 'text', text: 'Hello' },
        { type: 'inlineMath', attrs: { latex: 'a\nb' } },
      ],
    });
  });

  it('onSuccess with an empty latex closes the modal without inserting a math node', () => {
    editor = buildEditor();
    const { result } = renderHook(() => useMathsModal(editor));
    act(() => result.current.toggle());

    act(() => result.current.onSuccess(''));

    expect(result.current.isOpen).toBe(false);
    expect(JSON.stringify(editor.getJSON())).not.toContain('inlineMath');
    expect(editor.getText()).toContain('Hello');
  });
});
