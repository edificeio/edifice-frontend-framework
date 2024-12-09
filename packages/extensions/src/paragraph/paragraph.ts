import { Paragraph as TiptapParagraph } from '@tiptap/extension-paragraph';

/**
 * Extends `Paragraph` extension from TipTap.
 *
 * This extension is used to parse documents in old-format (version 0),
 * where text alignments were applied on a <div> wrapping a <span>.
 * The new format is a <p> with style attributes.
 *
 * For example :
 * `<div style="text-align: right;"><span style="font-size: 20pt;">A right-aligned text</span></div>`
 * is now parsed and rendered as
 * `<p style="text-align: right;"><span style="font-size: 20pt;">A right-aligned text</span></p>`
 */
export const Paragraph = TiptapParagraph.extend({
  parseHTML() {
    const parentRules = this.parent?.() ?? [];
    return [
      ...parentRules,
      {
        tag: 'div[style]:has(> span)',
      },
    ];
  },
});
