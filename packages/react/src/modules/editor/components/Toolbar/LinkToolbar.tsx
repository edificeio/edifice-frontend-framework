import { useCallback, useEffect, useMemo, useState } from 'react';

import { HyperlinkAttributes } from '@edifice.io/tiptap-extensions/hyperlink';
import { LinkerAttributes } from '@edifice.io/tiptap-extensions/linker';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { useTranslation } from 'react-i18next';

import { useEditorState } from '../../hooks/useEditorState';

import { Toolbar, ToolbarItem } from '../../../../components/Toolbar';
import {
  IconEdit,
  IconExternalLink,
  IconUnlink,
} from '../../../icons/components';
import {
  FLOATING_MENU_Z_INDEX,
  getFloatingMenuOptions,
} from './FloatingMenuOptions';

type LinkAttrs = LinkerAttributes | HyperlinkAttributes;

const floatingOptions = getFloatingMenuOptions({
  placement: 'bottom',
  offset: { mainAxis: 10, crossAxis: 0 },
});

interface LinkToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
  /** Handle Edit event */
  onEdit: (attrs: LinkAttrs | undefined) => void;
  /** Handle Open event */
  onOpen: (attrs: LinkAttrs | undefined) => void;
  /** Handle Unlink event */
  onUnlink: (attrs: LinkAttrs | undefined) => void;
}

const LinkToolbar = ({
  editor,
  onEdit,
  onOpen,
  onUnlink,
}: LinkToolbarProps) => {
  const { t } = useTranslation();
  const editorState = useEditorState(editor);

  // Current Linker node (or Hyperlink mark) attributes
  const [linkAttrs, setLinkAttrs] = useState<LinkAttrs | undefined>();

  const LinkToolbarItems: ToolbarItem[] = useMemo(() => {
    return [
      {
        type: 'icon',
        name: 'edit',
        props: {
          'icon': <IconEdit />,
          'aria-label': t('tiptap.link.toolbar.edit'),
          'onClick': () => onEdit?.(linkAttrs),
        },
        tooltip: {
          message: t('tiptap.link.toolbar.tooltip.edit'),
          position: 'bottom',
        },
      },
      {
        type: 'icon',
        name: 'open',
        props: {
          'icon': <IconExternalLink />,
          'aria-label': t('tiptap.link.toolbar.open'),
          'onClick': () => onOpen?.(linkAttrs),
        },
        tooltip: {
          message: t('tiptap.link.toolbar.tooltip.open'),
          position: 'bottom',
        },
      },
      {
        type: 'icon',
        name: 'unlink',
        props: {
          'icon': <IconUnlink className="text-danger" />,
          'aria-label': t('tiptap.link.toolbar.unlink'),
          'onClick': () => onUnlink?.(linkAttrs),
        },
        tooltip: {
          message: t('tiptap.link.toolbar.tooltip.unlink'),
          position: 'bottom',
        },
      },
    ];
  }, [onEdit, onOpen, onUnlink, t, linkAttrs]);

  // Retrieve any selected linker node ONLY WHEN EDITOR STATE CHANGES
  useEffect(() => {
    // `getAttributes` returns a generic Record - narrow it to the attrs shape
    // the active node/mark actually guarantees.
    if (editor?.isActive('linker'))
      setLinkAttrs(editor.getAttributes('linker') as LinkerAttributes);
    else if (editor?.isActive('hyperlink'))
      setLinkAttrs(editor.getAttributes('hyperlink') as HyperlinkAttributes);
    else setLinkAttrs(undefined);
  }, [editor, editorState]);

  // Memoized: an identity change here makes v3's BubbleMenu re-run a
  // `dispatch` effect, which combined with `useEditorState` above (re-renders
  // on every transaction) caused an infinite render loop.
  const handleShouldShow = useCallback(
    () =>
      (editor?.isEditable &&
        (editor?.isActive('linker') || editor?.isActive('hyperlink'))) ||
      false,
    [editor],
  );

  return (
    <>
      {editor && (
        // BubbleMenu, not FloatingMenu: `shouldShow` below overrides visibility
        // either way, this only changes the default position reference.
        <BubbleMenu
          editor={editor}
          options={floatingOptions}
          shouldShow={handleShouldShow}
          // v3's `options` has no `zIndex` field - set via style instead.
          style={{ zIndex: FLOATING_MENU_Z_INDEX }}
        >
          <Toolbar className="p-4" items={LinkToolbarItems} />
        </BubbleMenu>
      )}
    </>
  );
};

export default LinkToolbar;
