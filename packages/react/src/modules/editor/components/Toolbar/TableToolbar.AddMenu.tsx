import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Tooltip } from '../../../../components';
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconHighlightColumn,
  IconHighlightRow,
} from '../../../icons/components';

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
}

export const TableToolbarAddMenu = ({ editor }: Props) => {
  const { t } = useTranslation();

  const addOptions = [
    {
      key: 'add-above',
      icon: <IconArrowUp />,
      onClick: () => editor?.chain().focus().addRowBefore().run(),
      label: t('tiptap.table.toolbar.line.above'),
    },
    {
      key: 'add-below',
      icon: <IconArrowDown />,
      onClick: () => editor?.chain().focus().addRowAfter().run(),
      label: t('tiptap.table.toolbar.line.below'),
    },
    {
      key: 'add-left',
      icon: <IconArrowLeft />,
      onClick: () => editor?.chain().focus().addColumnBefore().run(),
      label: t('tiptap.table.toolbar.col.left'),
    },
    {
      key: 'add-right',
      icon: <IconArrowRight />,
      onClick: () => editor?.chain().focus().addColumnAfter().run(),
      label: t('tiptap.table.toolbar.col.right'),
    },
    {
      key: 'header-row',
      icon: <IconHighlightRow />,
      onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
      label: t('tiptap.table.toolbar.line.head'),
    },
    {
      key: 'header-col',
      icon: <IconHighlightColumn />,
      onClick: () => editor?.chain().focus().toggleHeaderColumn().run(),
      label: t('tiptap.table.toolbar.col.head'),
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.table.toolbar.tooltip.add')} placement="top">
        <Dropdown.Trigger
          variant="ghost"
          label={t('tiptap.table.toolbar.add')}
        />
      </Tooltip>
      <Dropdown.Menu>
        {addOptions.map((option) => (
          <div key={option.key} onMouseDown={(e) => e.preventDefault()}>
            <Dropdown.Item icon={option.icon} onClick={option.onClick}>
              {option.label}
            </Dropdown.Item>
          </div>
        ))}
      </Dropdown.Menu>
    </>
  );
};
