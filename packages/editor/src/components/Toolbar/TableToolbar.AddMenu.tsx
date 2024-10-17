import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  HighlightColumn,
  HighlightRow,
} from '@edifice.io/icons';
import { Dropdown, Tooltip } from '@edifice.io/react';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
}

export const TableToolbarAddMenu = ({ editor }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip message={t('tiptap.table.toolbar.tooltip.add')} placement="top">
        <Dropdown.Trigger
          variant="ghost"
          label={t('tiptap.table.toolbar.add')}
        />
      </Tooltip>
      <Dropdown.Menu>
        <Dropdown.Item
          key="add-above"
          icon={<ArrowUp />}
          onClick={() => editor?.chain().focus().addRowBefore().run()}
        >
          {t('tiptap.table.toolbar.line.above')}
        </Dropdown.Item>
        <Dropdown.Item
          key="add-below"
          icon={<ArrowDown />}
          onClick={() => editor?.chain().focus().addRowAfter().run()}
        >
          {t('tiptap.table.toolbar.line.below')}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="add-left"
          icon={<ArrowLeft />}
          onClick={() => editor?.chain().focus().addColumnBefore().run()}
        >
          {t('tiptap.table.toolbar.col.left')}
        </Dropdown.Item>
        <Dropdown.Item
          key="add-right"
          icon={<ArrowRight />}
          onClick={() => editor?.chain().focus().addColumnAfter().run()}
        >
          {t('tiptap.table.toolbar.col.right')}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="header-row"
          icon={<HighlightRow />}
          onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
        >
          {t('tiptap.table.toolbar.line.head')}
        </Dropdown.Item>
        <Dropdown.Item
          key="header-col"
          icon={<HighlightColumn />}
          onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}
        >
          {t('tiptap.table.toolbar.col.head')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </>
  );
};
