import { Node } from '@tiptap/core';

export const MathJax = Node.create({
  name: 'mathjaxnode',
  group: 'inline',
  inline: true,
  atom: false,
  selectable: true,

  parseHTML() {
    return [
      {
        tag: 'mathjax',
      },
    ];
  },

  addAttributes() {
    return {
      equation: {
        default: null,
        parseHTML: (element: any) => {
          const children = [...element.childNodes];
          const textNodes = children.filter((child) => child.nodeType === 3);
          return textNodes.length > 0
            ? textNodes[textNodes.length - 1].nodeValue
            : null;
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    let equation = (HTMLAttributes.equation || '')
      // Get what is between \begin{equation}{... ...}\end{equation}
      // Or between  \begin{equation}... ...\end{equation} without enclosing brackets
      .replaceAll(
        /(?:\\)?begin{equation}\s*\n?\s*{(.+?)}\n?\s*?(?:\\)?end{equation}/gm,
        '$$$1$$',
      )
      .replaceAll(
        /(?:\\)?begin{equation}\s*\n?\s*(.+?)\n?\s*?(?:\\)?end{equation}/gm,
        '$$$1$$',
      );
    if (equation.length > 0) {
      if (equation.charAt(0) !== '$') {
        equation = `$${equation}`;
      }
      if (equation.charAt(equation.length - 1) !== '$') {
        equation = `${equation}$`;
      }
    }
    return ['span', {}, equation];
  },
});
