import { Node } from '@tiptap/core';

export const Alert = Node.create({
  name: 'alert',
  content: 'inline+',
  marks: '',
  group: 'block',

  inline: false,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'p.info',
        priority: 60,
      },
      {
        tag: 'p.warning',
        priority: 60,
      },
      {
        tag: 'div.info',
        priority: 60,
      },
      {
        tag: 'div.warning',
        priority: 60,
      },
    ];
  },
  addAttributes() {
    return {
      class: {
        default: 'info',
        parseHTML: (element) => {
          return element.getAttribute('class');
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0];
  },
});
