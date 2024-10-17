import { RefObject } from 'react';

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BulletList,
  Code,
  OrderedList,
  SquareRoot,
  Subscript,
  Superscript,
  Table,
  TextVanilla,
} from '@edifice.io/icons';
import { DropdownMenuOptions, MediaLibraryRef } from '@edifice.io/react';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

export const useActionOptions = (
  editor: Editor | null,
  toggleMathsModal: Function,
  mediaLibraryRef: RefObject<MediaLibraryRef>,
) => {
  const { t } = useTranslation();
  const options: DropdownMenuOptions[] = [
    {
      icon: <TextVanilla />,
      label: t('tiptap.toolbar.removeFormat'),
      action: () => editor?.chain().clearNodes().unsetAllMarks().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: <Table />,
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
      icon: <Superscript />,
      label: t('tiptap.toolbar.superscript'),
      action: () => editor?.chain().focus().toggleSuperscript().run(),
    },
    {
      icon: <Subscript />,
      label: t('tiptap.toolbar.subscript'),
      action: () => editor?.chain().focus().toggleSubscript().run(),
    },
    {
      icon: <SquareRoot />,
      label: t('tiptap.toolbar.mathjax'),
      action: () => {
        toggleMathsModal();
      },
    },
    {
      type: 'divider',
    },
    {
      icon: <Code />,
      label: t('tiptap.toolbar.embed.iframe'),
      action: () => mediaLibraryRef.current?.show('embedder'),
    },
  ];
  const listOptions: DropdownMenuOptions[] = [
    {
      icon: <BulletList />,
      label: t('tiptap.toolbar.ulist'),
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <OrderedList />,
      label: t('tiptap.toolbar.olist'),
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];
  const alignmentOptions: DropdownMenuOptions[] = [
    {
      icon: <AlignLeft />,
      label: t('tiptap.toolbar.text.left'),
      action: () => editor?.chain().focus().setTextAlign('left').run(),
    },
    {
      icon: <AlignCenter />,
      label: t('tiptap.toolbar.text.center'),
      action: () => editor?.chain().focus().setTextAlign('center').run(),
    },
    {
      icon: <AlignRight />,
      label: t('tiptap.toolbar.text.right'),
      action: () => editor?.chain().focus().setTextAlign('right').run(),
    },
    {
      icon: <AlignJustify />,
      label: t('tiptap.toolbar.text.justify'),
      action: () => editor?.chain().focus().setTextAlign('justify').run(),
    },
  ];
  return [options, listOptions, alignmentOptions];
};
