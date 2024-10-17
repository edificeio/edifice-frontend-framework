import { Link } from '@tiptap/extension-link';

/** Our own model of an hyperlink in a rich document. */
export type HyperlinkAttributes = {
  href: string | null;
  target: '_blank' | null;
  title: string | null;
  text: string | null;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    hyperlink: {
      /**
       * Set an hyperlink mark
       */
      setLink: (attributes: Partial<HyperlinkAttributes>) => ReturnType;
      /**
       * Toggle an hyperlink mark
       */
      toggleLink: (attributes: {
        href: string;
        target?: string | null;
      }) => ReturnType;
      /**
       * Unset an hyperlink mark
       */
      unsetLink: () => ReturnType;
    };
  }
}

/**
 * Hyperlink (external links), extends `Link` extension from TipTap.
 *
 * Links to external resources MUST NOT have a `data-id` nor a `data-app-prefix` attribute.
 * The `target` attribute has to be sanitized, so it is overriden.
 */
export const Hyperlink = Link.extend({
  name: 'hyperlink',

  parseHTML() {
    return [
      {
        tag: 'a[href]:not([href *= "javascript:" i])',
        // Be sure no data-id and data-app-prefix attribute exists :
        // it would then be an Linker, not an Hyperlink !
        getAttrs: (node: HTMLAnchorElement) => {
          // See https://prosemirror.net/docs/ref/version/0.18.0.html#model.ParseRule.getAttrs
          if (
            node.getAttribute('data-id') &&
            node.getAttribute('data-app-prefix')
          )
            return false;
        },
      },
    ];
  },

  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      HTMLAttributes: {
        ...this.parent?.().HTMLAttributes,
        target: null,
      },
    };
  },

  /* Manage `title` and `target` attributes. */
  addAttributes() {
    return {
      // Preserve attributes of parent extension...
      ...this.parent?.(),
      // ...then add or override the following :
      //------------------
      target: {
        default: this.options.HTMLAttributes.target,
        // Sanitize target value
        parseHTML: (element) =>
          element.getAttribute('target') !== '_blank' ? null : '_blank',
        renderHTML: (attributes) => ({
          target: attributes['target'],
        }),
      },
      title: {
        default: this.options.HTMLAttributes.title,
      },
    };
  },
});
