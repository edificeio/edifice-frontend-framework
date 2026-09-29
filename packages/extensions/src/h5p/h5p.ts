import { mergeAttributes, Node } from '@tiptap/core';

/**
 * Accepted activity id: a UUID and nothing else. The node carries no other data, so it
 * is its own allow-list: pasted HTML cannot smuggle a URL or an arbitrary attribute in.
 */
const CONTENT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isH5PContentId = (value: unknown): value is string =>
  typeof value === 'string' && CONTENT_ID_PATTERN.test(value);

export interface H5POptions {
  /**
   * Opens the host application's activity editor: without an id to create one, with the
   * id to edit it. When undefined, the toolbar button is hidden.
   */
  onRequestEdit?: (contentId?: string) => void;
  /** Label of the fallback link, for readers that do not render the block. */
  fallbackLabel: string;
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    h5p: {
      /** Inserts an H5P activity at the current position. */
      insertH5P: (options: { contentId: string }) => ReturnType;
    };
  }
}

/**
 * An interactive H5P activity embedded in rich content.
 *
 * Only the id is persisted (see edifice-h5p, docs/architecture-cible.md §4):
 * `<div class="h5p-activity" data-h5p-id="…">` with a fallback link to the standalone
 * player page `/h5p/embed/{id}`, readable by older mobile apps, previews and
 * notifications. The interactive rendering is provided by the host application through
 * a NodeView (`H5PNodeView` from @edifice.io/react/editor).
 */
export const H5P = Node.create<H5POptions>({
  name: 'h5p',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      onRequestEdit: undefined,
      fallbackLabel: 'Activité interactive',
      HTMLAttributes: { class: 'h5p-activity' },
    };
  },

  addAttributes() {
    return {
      contentId: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute('data-h5p-id');
          return isH5PContentId(value) ? value : null;
        },
        renderHTML: (attributes) =>
          isH5PContentId(attributes.contentId)
            ? { 'data-h5p-id': attributes.contentId }
            : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-h5p-id]',
        // The fallback link is regenerated on render: only the id is read back.
        getAttrs: (element) =>
          isH5PContentId((element as HTMLElement).getAttribute('data-h5p-id'))
            ? null
            : false,
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const contentId = node.attrs.contentId as string | null;
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'a',
        {
          href: isH5PContentId(contentId) ? `/h5p/embed/${contentId}` : '#',
          target: '_blank',
          rel: 'noopener',
        },
        this.options.fallbackLabel,
      ],
    ];
  },

  addCommands() {
    return {
      insertH5P:
        ({ contentId }) =>
        ({ commands }) =>
          isH5PContentId(contentId) &&
          commands.insertContent({ type: this.name, attrs: { contentId } }),
    };
  },
});
