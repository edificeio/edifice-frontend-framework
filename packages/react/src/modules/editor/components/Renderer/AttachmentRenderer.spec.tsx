import { Editor } from '@tiptap/react';

import { render, screen } from '~/setup';
import { EditorContext } from '../../hooks/useEditorContext';
import AttachmentRenderer from './AttachmentRenderer';

interface LinkFixture {
  'name': string;
  'href': string;
  'dataDocumentId'?: string;
  'dataContentType'?: string;
  'documentId'?: string;
  'data-document-id'?: string;
}

function link(overrides: Partial<LinkFixture> = {}): LinkFixture {
  return {
    name: 'report.pdf',
    href: '/workspace/document/abc',
    dataDocumentId: 'abc',
    dataContentType: 'application/pdf',
    ...overrides,
  };
}

function makeNode(links: LinkFixture[]) {
  return { attrs: { links } } as any;
}

function renderAttachmentRenderer(
  props: {
    node: ReturnType<typeof makeNode>;
    editor?: Editor;
    updateAttributes?: (attrs: any) => void;
    deleteNode?: () => void;
  },
  editable = true,
) {
  const editor = props.editor ?? ({ commands: {} } as unknown as Editor);

  return render(
    <EditorContext.Provider
      value={{ id: 'x', appCode: 'wiki', editor, editable }}
    >
      <AttachmentRenderer
        node={props.node}
        editor={editor}
        updateAttributes={props.updateAttributes}
        deleteNode={props.deleteNode}
      />
    </EditorContext.Provider>,
  );
}

describe('AttachmentRenderer', () => {
  it('renders one Attachment row per link, with the download link attrs', () => {
    const links = [
      link({ name: 'first.pdf', href: '/first', dataDocumentId: 'doc-1' }),
      link({ name: 'second.pdf', href: '/second', dataDocumentId: 'doc-2' }),
    ];

    renderAttachmentRenderer({ node: makeNode(links) });

    expect(screen.getAllByText('first.pdf')[0]).toBeInTheDocument();
    expect(screen.getAllByText('second.pdf')[0]).toBeInTheDocument();

    const anchor = document.querySelector('a[href="/first"]');
    expect(anchor).toHaveAttribute('data-document-id', 'doc-1');
    expect(anchor).toHaveAttribute('data-content-type', 'application/pdf');
    expect(anchor).toHaveAttribute('download');
  });

  it('renders nothing when there are no links', () => {
    const { container } = renderAttachmentRenderer({ node: makeNode([]) });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the delete button only when the editor is editable', () => {
    const links = [link({ name: 'report.pdf' })];

    const { unmount } = renderAttachmentRenderer(
      { node: makeNode(links) },
      true,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    unmount();

    renderAttachmentRenderer({ node: makeNode(links) }, false);
    expect(
      screen.queryByRole('button', { name: 'Delete' }),
    ).not.toBeInTheDocument();
  });

  it('deletes one of several links and calls updateAttributes with the remaining ones', async () => {
    const links = [
      link({ name: 'first.pdf', href: '/first', dataDocumentId: 'doc-1' }),
      link({ name: 'second.pdf', href: '/second', dataDocumentId: 'doc-2' }),
      link({ name: 'third.pdf', href: '/third', dataDocumentId: 'doc-3' }),
    ];
    const updateAttributes = vi.fn();
    const deleteNode = vi.fn();
    const node = makeNode(links);

    const { user } = renderAttachmentRenderer({
      node,
      updateAttributes,
      deleteNode,
    });

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    });
    await user.click(deleteButtons[1]);

    expect(updateAttributes).toHaveBeenCalledWith({
      ...node.attrs,
      links: [links[0], links[2]],
    });
    expect(deleteNode).not.toHaveBeenCalled();
  });

  it('calls deleteNode instead of updateAttributes when deleting the last remaining link', async () => {
    const links = [link({ name: 'only.pdf', href: '/only' })];
    const updateAttributes = vi.fn();
    const deleteNode = vi.fn();

    const { user } = renderAttachmentRenderer({
      node: makeNode(links),
      updateAttributes,
      deleteNode,
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteNode).toHaveBeenCalledTimes(1);
    expect(updateAttributes).not.toHaveBeenCalled();
  });

  it('falls back to editor.commands.unsetAttachment when updateAttributes and deleteNode are both undefined', async () => {
    const links = [
      link({ name: 'first.pdf', href: '/first', dataDocumentId: 'doc-1' }),
      link({ name: 'second.pdf', href: '/second', dataDocumentId: 'doc-2' }),
    ];
    const unsetAttachment = vi.fn();
    const editor = {
      commands: { unsetAttachment },
    } as unknown as Editor;

    const { user } = renderAttachmentRenderer({
      node: makeNode(links),
      editor,
      updateAttributes: undefined,
      deleteNode: undefined,
    });

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    });
    await user.click(deleteButtons[0]);

    expect(unsetAttachment).toHaveBeenCalledWith('doc-1');
  });

  it('falls back through documentId, data-document-id and href when dataDocumentId is absent', async () => {
    const links = [
      // No `dataDocumentId`: the id-resolution chain used by the onClick
      // handler must fall through `data-document-id`, then `href`.
      link({
        name: 'legacy.pdf',
        href: '/legacy',
        dataDocumentId: undefined,
        documentId: 'legacy-id',
      }),
      // No `dataDocumentId`/`documentId`/`data-document-id`: the internal
      // handleDelete chain must fall all the way through to `href`.
      link({
        name: 'bare.pdf',
        href: '/bare',
        dataDocumentId: undefined,
        documentId: undefined,
      }),
      link({ name: 'other.pdf', href: '/other' }),
    ];
    const updateAttributes = vi.fn();
    const node = makeNode(links);

    const { user } = renderAttachmentRenderer({ node, updateAttributes });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(updateAttributes).toHaveBeenCalledWith({
      ...node.attrs,
      links: [links[1], links[2]],
    });
  });

  it('falls back to empty-string comparisons when links have no resolvable id and no documentId is passed', async () => {
    // The `i === index` short-circuit means the comparison on line 50 is
    // only actually evaluated for entries OTHER than the one being deleted.
    // To exercise the `?? ''` fallback on both sides of that comparison,
    // the deleted entry (index 0) must resolve to an undefined documentId,
    // and another, distinct entry (index 1) must also resolve to an
    // undefined linkDocumentId; both then compare equal via '' === '' and
    // get swept up too, leaving only the third, well-formed entry.
    const links = [
      link({
        name: 'anonymous.pdf',
        href: undefined,
        dataDocumentId: undefined,
        documentId: undefined,
      }),
      link({
        name: 'also-anonymous.pdf',
        href: undefined,
        dataDocumentId: undefined,
        documentId: undefined,
      }),
      link({ name: 'other.pdf', href: '/other' }),
    ];
    const updateAttributes = vi.fn();
    const node = makeNode(links);

    const { user } = renderAttachmentRenderer({ node, updateAttributes });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(updateAttributes).toHaveBeenCalledWith({
      ...node.attrs,
      links: [links[2]],
    });
  });

  it('resyncs local state via useEffect when the node.attrs.links reference changes', () => {
    const firstLinks = [link({ name: 'first.pdf', href: '/first' })];
    const node = makeNode(firstLinks);

    const { rerender } = renderAttachmentRenderer({ node });

    expect(screen.getByText('first.pdf')).toBeInTheDocument();

    const secondLinks = [
      link({ name: 'first.pdf', href: '/first' }),
      link({ name: 'new.pdf', href: '/new' }),
    ];
    const nextNode = makeNode(secondLinks);
    const editor = { commands: {} } as unknown as Editor;

    rerender(
      <EditorContext.Provider
        value={{ id: 'x', appCode: 'wiki', editor, editable: true }}
      >
        <AttachmentRenderer node={nextNode} editor={editor} />
      </EditorContext.Provider>,
    );

    expect(screen.getByText('new.pdf')).toBeInTheDocument();
  });
});
