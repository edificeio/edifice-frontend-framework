import { Node } from '@tiptap/core';

export interface AttachmentOptions {
  HTMLAttributes: Record<string, string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      setAttachment: (attachment) => ReturnType;
    };
  }
}

export const AttachmentTransformer = Node.create<AttachmentOptions>({
  name: 'attachments',
  content: '',
  marks: '',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'attachments',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[class=attachments]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const links = HTMLAttributes.links;

    const renderedLinks = links.map((el) => {
      return [
        'a',
        {
          'name': el.name,
          'href': el.href,
          'data-document-id': el['data-document-id'],
          'data-content-type': el['data-content-type'],
        },
        el.name,
      ];
    });

    return ['div', this.options.HTMLAttributes, ...renderedLinks];
  },

  addAttributes() {
    return {
      links: {
        default: [],
        parseHTML: (element) => {
          const links = element.getElementsByTagName('a');
          const parsedLinks = [];

          for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const href = link.getAttribute('href');
            const name = link.textContent;
            const regexResult = href.match(/([^/]+$)/);
            const dataDocumentId =
              link.getAttribute('data-document-id') ||
              (regexResult && regexResult[0]);
            const dataContentType = link.getAttribute('data-content-type');

            parsedLinks.push({
              href: href,
              name: name,
              dataDocumentId,
              dataContentType,
            });
          }

          return parsedLinks;
        },
        renderHTML: (attributes) => {
          return {
            links: attributes.links.map((link) => ({
              'href': link.href,
              'name': link.name,
              'data-document-id': link.dataDocumentId,
              'data-content-type': link.dataContentType,
            })),
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setAttachment:
        (
          attrs = {
            dataContentType: '',
            name: '',
            documentId: '',
            href: '',
          },
        ) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },
});
