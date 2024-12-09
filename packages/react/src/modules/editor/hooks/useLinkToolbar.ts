import { RefObject, useCallback } from 'react';

import { HyperlinkAttributes } from '@edifice.io/tiptap-extensions/hyperlink';
import { LinkerAttributes } from '@edifice.io/tiptap-extensions/linker';
import { Editor } from '@tiptap/react';
import { MediaLibraryRef } from '../../multimedia';

/**
 * Custom hook to handle LinkToolbar events.
 * @returns {
 * `onOpen`: Opens a link ,
 * `onEdit`: Edit a link,
 * `onUnlink`: Removes a link,
 * }
 */
export const useLinkToolbar = (
  editor: Editor | null,
  mediaLibraryRef: RefObject<MediaLibraryRef>,
) => {
  const onEdit = useCallback(
    (attrs: LinkerAttributes | HyperlinkAttributes) => {
      // If a link is active, select it.
      // see https://github.com/ProseMirror/prosemirror-state/blob/88e2a24104481098f0f660e74240c0f846e7fd6e/src/selection.ts#L320
      // Edit: 2024-01-08 when this function is called, the linker node is already selected !
      // => Nothing to do, since the linkToolbar only appears when linker node is selected.
      // if (editor?.isActive("linker"))
      //   editor?.commands.setNodeSelection(editor?.state.selection.$from.pos);
      if (editor?.isActive('hyperlink'))
        editor.commands.extendMarkRange('hyperlink');

      const attrsLinker = attrs as LinkerAttributes;
      if (attrsLinker['data-id'] || attrsLinker['data-app-prefix']) {
        mediaLibraryRef.current?.showLink({
          target: attrs.target,
          resourceId: attrsLinker['data-id'],
          appPrefix: attrsLinker['data-app-prefix'],
        });
      } else {
        const { href, target } = attrs as HyperlinkAttributes;
        mediaLibraryRef.current?.showLink({
          link: {
            url: href || '',
            target: target || undefined,
            text: editor?.state.selection.empty
              ? ''
              : editor?.state.selection.content().content.child(0).textContent,
          },
        });
      }
    },
    [editor, mediaLibraryRef],
  );

  const onOpen = (attrs: LinkerAttributes) => {
    window.open(attrs.href || 'about:blank', '_blank');
  };

  const onUnlink = (/*attrs: LinkerAttributes*/) => {
    editor?.commands.unsetLinker?.();
    editor?.commands.unsetLink?.();
  };

  return {
    onEdit,
    onOpen,
    onUnlink,
  };
};
