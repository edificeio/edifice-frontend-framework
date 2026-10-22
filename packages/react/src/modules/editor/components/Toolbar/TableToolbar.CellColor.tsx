import { useCallback, useEffect, useState } from 'react';

import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import {
  ColorPalette,
  ColorPicker,
  ColorPickerItem,
  DefaultPalette,
  Dropdown,
  Tooltip,
} from '../../../../components';
import { useEditorState } from '../../hooks/useEditorState';

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
  /**
   * Tracks refs on ColorPickers.
   */
  itemRefs: any;
}

export const TableToolbarCellColor = ({ editor, itemRefs }: Props) => {
  const { t } = useTranslation();

  // Cell color, defaults to "transparent".
  const [color, setColor] = useState<string>('transparent');
  // editor?.state alone doesn't trigger a re-render on a pure selection move
  // (no content edit, e.g. clicking into a differently-colored cell).
  const editorState = useEditorState(editor);

  // Triggered when the user chooses a color for cells background.
  const applyColor = useCallback(
    (value: string) => {
      editor
        ?.chain()
        .focus()
        .setCellAttribute(
          'backgroundColor',
          // reset color is transparent here => remove bkg color
          value === 'transparent' ? '' : value,
        )
        .run();
      setColor(value);
    },
    [editor, setColor],
  );

  // When cursor moves in table, update the current background color.
  useEffect(() => {
    setColor(
      editor?.getAttributes('tableCell').backgroundColor ?? 'transparent',
    );
  }, [editor, editorState]);

  // Palettes of available colors to choose from.
  const palettes: ColorPalette[] = [
    {
      ...DefaultPalette,
      label: t('tiptap.table.toolbar.cell.color'),
      reset: {
        value: 'transparent',
        description: t('tiptap.table.toolbar.cell.none'),
        isReset: true,
      },
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.table.toolbar.cell.bk')} placement="top">
        <Dropdown.Trigger
          variant="ghost"
          aria-label={t('tiptap.table.toolbar.cell.bk')}
          icon={
            <ColorPickerItem
              model={{
                value: color,
                description: '',
                isReset:
                  !color || color.length === 0 || color === 'transparent',
              }}
            />
          }
        />
      </Tooltip>
      <Dropdown.Menu>
        <ColorPicker
          ref={(el) => (itemRefs.current['color-picker'] = el)}
          model={color}
          palettes={palettes}
          onSuccess={(item) => applyColor(item.value)}
        />
      </Dropdown.Menu>
    </>
  );
};
