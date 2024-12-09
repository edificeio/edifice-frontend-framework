import { RefObject } from 'react';

import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { DropdownMenuOptions } from '../../../components';
import {
  IconAlignCenter,
  IconAlignJustify,
  IconAlignLeft,
  IconAlignRight,
  IconBulletList,
  IconCode,
  IconOrderedList,
  IconSquareRoot,
  IconSubscript,
  IconSuperscript,
  IconTable,
  IconTextVanilla,
} from '../../icons/components';
import { MediaLibraryRef } from '../../multimedia';

export const useActionOptions = (
  editor: Editor | null,
  toggleMathsModal: () => void,
  mediaLibraryRef: RefObject<MediaLibraryRef>,
) => {
  const { t } = useTranslation();
  const options: DropdownMenuOptions[] = [
    {
      icon: <IconTextVanilla />,
      label: t('tiptap.toolbar.removeFormat'),
      action: () => editor?.chain().clearNodes().unsetAllMarks().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: <IconTable />,
      label: t('tiptap.toolbar.table'),
      action: () =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      type: 'divider',
    },
    {
      icon: <IconSuperscript />,
      label: t('tiptap.toolbar.superscript'),
      action: () => editor?.chain().focus().toggleSuperscript().run(),
    },
    {
      icon: <IconSubscript />,
      label: t('tiptap.toolbar.subscript'),
      action: () => editor?.chain().focus().toggleSubscript().run(),
    },
    {
      icon: <IconSquareRoot />,
      label: t('tiptap.toolbar.mathjax'),
      action: () => {
        toggleMathsModal();
      },
    },
    {
      type: 'divider',
    },
    {
      icon: <IconCode />,
      label: t('tiptap.toolbar.embed.iframe'),
      action: () => mediaLibraryRef.current?.show('embedder'),
    },
  ];
  const listOptions: DropdownMenuOptions[] = [
    {
      icon: <IconBulletList />,
      label: t('tiptap.toolbar.ulist'),
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <IconOrderedList />,
      label: t('tiptap.toolbar.olist'),
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];
  const alignmentOptions: DropdownMenuOptions[] = [
    {
      icon: <IconAlignLeft />,
      label: t('tiptap.toolbar.text.left'),
      action: () => editor?.chain().focus().setTextAlign('left').run(),
    },
    {
      icon: <IconAlignCenter />,
      label: t('tiptap.toolbar.text.center'),
      action: () => editor?.chain().focus().setTextAlign('center').run(),
    },
    {
      icon: <IconAlignRight />,
      label: t('tiptap.toolbar.text.right'),
      action: () => editor?.chain().focus().setTextAlign('right').run(),
    },
    {
      icon: <IconAlignJustify />,
      label: t('tiptap.toolbar.text.justify'),
      action: () => editor?.chain().focus().setTextAlign('justify').run(),
    },
  ];
  return [options, listOptions, alignmentOptions];
};
