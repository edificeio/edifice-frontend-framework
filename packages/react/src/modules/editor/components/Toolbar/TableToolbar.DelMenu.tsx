import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { Dropdown, Tooltip } from "../../../../components";
import {
  IconDelete,
  IconDeleteColumn,
  IconDeleteColumnHighlight,
  IconDeleteRow,
  IconDeleteRowHighlight,
} from "../../../icons/components";

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
}

export const TableToolbarDelMenu = ({ editor }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip message={t("tiptap.table.toolbar.tooltip.del")} placement="top">
        <Dropdown.Trigger
          variant="ghost"
          label={t("tiptap.table.toolbar.del")}
        />
      </Tooltip>
      <Dropdown.Menu>
        <Dropdown.Item
          key="del-row"
          icon={<IconDeleteRow />}
          onClick={() => editor?.chain().focus().deleteRow().run()}
        >
          {t("tiptap.table.toolbar.del.line")}
        </Dropdown.Item>
        <Dropdown.Item
          key="del-col"
          icon={<IconDeleteColumn />}
          onClick={() => editor?.chain().focus().deleteColumn().run()}
        >
          {t("tiptap.table.toolbar.del.col")}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="del-header-row"
          icon={<IconDeleteRowHighlight />}
          onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
        >
          {t("tiptap.table.toolbar.del.line.head")}
        </Dropdown.Item>
        <Dropdown.Item
          key="del-header-col"
          icon={<IconDeleteColumnHighlight />}
          onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}
        >
          {t("tiptap.table.toolbar.del.col.head")}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="del-table"
          icon={<IconDelete />}
          onClick={() => editor?.chain().focus().deleteTable().run()}
        >
          {t("tiptap.table.toolbar.del.array")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </>
  );
};
