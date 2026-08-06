import { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import { render, screen } from '~/setup';
import { createTestEditor } from '../../test-utils/createTestEditor';
import BubbleMenuEditImage from './BubbleMenuEditImage';

// `@tiptap/react`'s real BubbleMenu depends on tippy.js, whose CJS build
// does not interop cleanly with Vitest's ESM loader in this monorepo (a
// default import of `tippy.js` resolves to the whole CJS module namespace
// instead of the exported function), and it relocates its content via
// direct DOM manipulation outside of React, unrelated to what
// BubbleMenuEditImage itself is responsible for. Replace BubbleMenu with a
// minimal component that always renders its own wrapper (carrying the real
// `className`, e.g. the `d-none` class the component applies while
// `openEditImage` is true) and shows its children only when `shouldShow`
// returns true, keeping everything in the normal React tree so RTL can
// query it.
vi.mock('@tiptap/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tiptap/react')>();
  return {
    ...actual,
    BubbleMenu: ({ editor, shouldShow, children, className }: any) => {
      const visible = shouldShow
        ? shouldShow({ editor, view: editor?.view, state: editor?.state })
        : true;
      return <div className={className}>{visible ? children : null}</div>;
    },
  };
});

// Inserts a real `custom-image` node with the given attributes and selects
// it with a NodeSelection, mirroring how the schema places selection.anchor
// at the node's own start position (what BubbleMenuEditImage reads via
// `editor.view.state.doc.nodeAt(selection.anchor)`).
function insertAndSelectImage(
  editor: Editor,
  attrs: { src?: string; size?: string; width?: number | string },
) {
  editor.commands.insertContent({
    type: 'custom-image',
    attrs: { src: 'foo.png', ...attrs },
  });

  let imgPos: number | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'custom-image' && imgPos === undefined) {
      imgPos = pos;
    }
  });

  const tr = editor.state.tr.setSelection(
    NodeSelection.create(editor.state.doc, imgPos as number),
  );
  editor.view.dispatch(tr);
}

// Reads back the `custom-image` node's attrs directly from the document,
// regardless of the current selection: `setAttributes` replaces the node
// with a fresh one via `tr.replaceRangeWith`, after which the selection is
// no longer guaranteed to sit on that node, so `editor.getAttributes(...)`
// (which is selection-based) can no longer be relied on.
function getImageAttrs(editor: Editor) {
  let attrs: Record<string, unknown> | undefined;
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'custom-image' && attrs === undefined) {
      attrs = node.attrs;
    }
  });
  return attrs;
}

describe('BubbleMenuEditImage', () => {
  let editor: Editor;

  beforeAll(() => {
    // Toolbar unconditionally calls useBreakpoint, which relies on
    // window.matchMedia, absent from jsdom.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  beforeEach(() => {
    editor = createTestEditor();
  });

  afterEach(() => {
    editor?.destroy();
  });

  it('does not render when the selection is not on an image', () => {
    render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={true}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is hidden (d-none) while the edit-image panel is open', () => {
    insertAndSelectImage(editor, { size: 'medium', width: 350 });

    const { container } = render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={true}
        editable={true}
      />,
    );

    expect(container.querySelector('.d-none')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render the Toolbar items when not editable', () => {
    insertAndSelectImage(editor, { size: 'medium', width: 350 });

    render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={false}
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks the medium size button as selected and leaves the others unselected', () => {
    insertAndSelectImage(editor, { size: 'medium', width: 350 });

    render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={true}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Medium image',
      }),
    ).toHaveClass('is-selected');
    expect(
      screen.getByRole('button', {
        name: 'Small image',
      }),
    ).not.toHaveClass('is-selected');
    expect(
      screen.getByRole('button', {
        name: 'Large image',
      }),
    ).not.toHaveClass('is-selected');
  });

  it('marks the small size button as selected when size/width match', () => {
    insertAndSelectImage(editor, { size: 'small', width: 250 });

    render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={true}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Small image',
      }),
    ).toHaveClass('is-selected');
  });

  it('marks the large size button as selected when size/width match', () => {
    insertAndSelectImage(editor, { size: 'large', width: 500 });

    render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={true}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Large image',
      }),
    ).toHaveClass('is-selected');
  });

  it('does not select any size button when width does not match the known sizes', () => {
    insertAndSelectImage(editor, { size: 'medium', width: 400 });

    render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={true}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Small image',
      }),
    ).not.toHaveClass('is-selected');
    expect(
      screen.getByRole('button', {
        name: 'Medium image',
      }),
    ).not.toHaveClass('is-selected');
    expect(
      screen.getByRole('button', {
        name: 'Large image',
      }),
    ).not.toHaveClass('is-selected');
  });

  it('sets width/height/size attributes when clicking a size button', async () => {
    insertAndSelectImage(editor, { size: 'medium', width: 350 });

    const { user } = render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={vi.fn()}
        openEditImage={false}
        editable={true}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Small image',
      }),
    );

    expect(getImageAttrs(editor)).toMatchObject({
      size: 'small',
      width: 250,
      height: 'auto',
    });
  });

  it('calls onEditImage when clicking the edit button', async () => {
    insertAndSelectImage(editor, { size: 'medium', width: 350 });
    const onEditImage = vi.fn();

    const { user } = render(
      <BubbleMenuEditImage
        editor={editor}
        onEditImage={onEditImage}
        openEditImage={false}
        editable={true}
      />,
    );

    // Toolbar's 'button' case overrides the item's aria-label with its
    // `name` field, so the accessible name is the literal item name ('edit'),
    // not the translated tooltip text used for icon buttons.
    await user.click(screen.getByRole('button', { name: 'edit' }));

    expect(onEditImage).toHaveBeenCalled();
  });
});
