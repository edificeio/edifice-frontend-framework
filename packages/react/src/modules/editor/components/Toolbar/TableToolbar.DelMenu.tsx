import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Tooltip } from '../../../../components';
import {
  IconDelete,
  IconDeleteColumn,
  IconDeleteColumnHighlight,
  IconDeleteRow,
  IconDeleteRowHighlight,
} from '../../../icons/components';

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
}

export const TableToolbarDelMenu = ({ editor }: Props) => {
  const { t } = useTranslation();

  const delOptions = [
    {
      key: 'del-row',
      icon: <IconDeleteRow />,
      onClick: () => editor?.chain().focus().deleteRow().run(),
      label: t('tiptap.table.toolbar.del.line'),
    },
    {
      key: 'del-col',
      icon: <IconDeleteColumn />,
      onClick: () => editor?.chain().focus().deleteColumn().run(),
      label: t('tiptap.table.toolbar.del.col'),
    },
    {
      key: 'del-header-row',
      icon: <IconDeleteRowHighlight />,
      onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
      label: t('tiptap.table.toolbar.del.line.head'),
    },
    {
      key: 'del-header-col',
      icon: <IconDeleteColumnHighlight />,
      onClick: () => editor?.chain().focus().toggleHeaderColumn().run(),
      label: t('tiptap.table.toolbar.del.col.head'),
    },
    {
      key: 'del-table',
      icon: <IconDelete />,
      onClick: () => editor?.chain().focus().deleteTable().run(),
      label: t('tiptap.table.toolbar.del.array'),
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.table.toolbar.tooltip.del')} placement="top">
        <Dropdown.Trigger
          variant="ghost"
          label={t('tiptap.table.toolbar.del')}
        />
      </Tooltip>
      <Dropdown.Menu>
        {delOptions.map((option) => (
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
