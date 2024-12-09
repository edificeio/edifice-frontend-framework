import { addTimestampToImageUrl } from '@edifice.io/utilities';
import { Editor } from '@tiptap/react';
/**
 * This hooks lets manipulate selected image node by
 * - setting attributes
 * - getting their attributes
 *
 * @param editor
 * @returns
 */
export function useImageSelection(editor?: Editor | null | undefined) {
  const getSelection = () => {
    const datas: Array<{ src: string; title: string; alt: string }> = [];
    if (!editor) {
      return datas;
    }
    const { $from, $to } = editor.state.selection;
    editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (
        node.isAtom &&
        (node.type.name === 'image' || node.type.name === 'custom-image')
      ) {
        const { src, title, alt } = node.attrs;
        datas.push({
          src,
          title,
          alt,
        });
      }
    });
    return datas;
  };
  const setAttributes = ({
    url,
    alt,
    title,
  }: {
    url: string;
    alt?: string;
    title?: string;
  }) => {
    // Update our custom image node
    const hasUpdate = editor
      ?.chain()
      .updateAttributes('custom-image', {
        src: addTimestampToImageUrl(url),
        alt,
        title,
      })
      .run();
    // If run failed => try update native image node
    if (!hasUpdate) {
      editor
        ?.chain()
        .updateAttributes('image', {
          src: addTimestampToImageUrl(url),
          alt,
          title,
        })
        .run();
    }
  };
  return { setAttributes, getSelection };
}
