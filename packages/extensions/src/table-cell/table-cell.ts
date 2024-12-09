import { TableCell as TipTapTableCell } from '@tiptap/extension-table-cell';

/**
 * This custom extension allows setting a background-color to table cells.
 * Apply with ̀`editor.chain().focus().setCellAttribute("backgroundColor", color).run()`
 */
export const TableCell = TipTapTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        renderHTML: (attributes: { backgroundColor?: string }) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
        parseHTML: (element: { style?: { backgroundColor: string } }) => {
          return element.style?.backgroundColor?.replace(/['"]+/g, '');
        },
      },
    };
  },
});
