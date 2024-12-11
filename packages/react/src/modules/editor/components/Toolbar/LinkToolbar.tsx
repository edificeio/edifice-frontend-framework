import { useEffect, useMemo, useState } from 'react';

import { Editor, FloatingMenu } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

import { Toolbar, ToolbarItem } from '../../../../components/Toolbar';
import {
  IconEdit,
  IconExternalLink,
  IconUnlink,
} from '../../../icons/components';
import { tippyOptions } from './LinkToolbar.TippyOptions';

interface LinkToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
  /** Handle Edit event */
  onEdit: (attrs: any) => void;
  /** Handle Open event */
  onOpen: (attrs: any) => void;
  /** Handle Unlink event */
  onUnlink: (attrs: any) => void;
}

const LinkToolbar = ({
  editor,
  onEdit,
  onOpen,
  onUnlink,
}: LinkToolbarProps) => {
  const { t } = useTranslation();

  // Current Linker node (or Hyperlink mark) attributes
  const [linkAttrs, setLinkAttrs] = useState<Record<string, any> | undefined>();

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
    if (editor?.isActive('linker'))
      setLinkAttrs(editor.getAttributes('linker'));
    else if (editor?.isActive('hyperlink'))
      setLinkAttrs(editor.getAttributes('hyperlink'));
    else setLinkAttrs(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state]);

  const handleShouldShow = () =>
    (editor?.isEditable &&
      (editor?.isActive('linker') || editor?.isActive('hyperlink'))) ||
    false;

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={tippyOptions}
          shouldShow={handleShouldShow}
        >
          <Toolbar className="p-4" items={LinkToolbarItems} />
        </FloatingMenu>
      )}
    </>
  );
};

export default LinkToolbar;
