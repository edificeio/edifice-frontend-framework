import { RefAttributes, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  AccessiblePalette,
  ColorPalette,
  ColorPicker,
  DefaultPalette,
  Dropdown,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '../../../../components';
import { useDropdownContext } from '../../../../components/Dropdown/DropdownContext';
import { IconTextColor } from '../../../icons/components';
import { useEditorContext } from '../../hooks/useEditorContext';

interface Props {
  /**
   * Props for the trigger
   */
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
  /**
   * Tracks refs on ColorPickers.
   */
  itemRefs: any;
}

export const EditorToolbarTextColor = ({ triggerProps, itemRefs }: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();
  const { visible } = useDropdownContext();

  // Manage text and background colors.
  const [color, setColor] = useState<string>('#4A4A4A');

  // Triggered when the user chooses a color for cells background.
  const applyColor = useCallback(
    (value: string) => {
      // If the same color is picked, remove it (=toggle mode).
      if (value === color) {
        setColor('');
        editor?.chain().focus().unsetColor().run();
      } else {
        setColor(value);
        editor?.chain().focus().setColor(value).run();
      }
    },
    [color, editor],
  );

  // When cursor moves in table, update the current text color.
  useEffect(() => {
    const textStyle = editor?.getAttributes('textStyle');
    setColor(textStyle?.color ?? '#4A4A4A');
  }, [editor, editor?.state]);

  // Palettes of available colors to choose from.
  const palettes: ColorPalette[] = [
    { ...DefaultPalette, label: t('tiptap.toolbar.color.text') },
    {
      ...AccessiblePalette,
      label: t('tiptap.toolbar.color.a13y'),
      tooltip: {
        message: t('tiptap.toolbar.color.a13y.hint'),
        placement: 'right',
      },
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.toolbar.color.text')} placement="top">
        <IconButton
          {...triggerProps}
          type="button"
          variant="ghost"
          color="tertiary"
          icon={<IconTextColor />}
          aria-label={t('tiptap.toolbar.color.text')}
          className={visible ? 'is-selected' : ''}
        />
      </Tooltip>
      <Dropdown.Menu>
        <ColorPicker
          ref={(el: any) => (itemRefs.current['color-picker'] = el)}
          model={color}
          palettes={palettes}
          onSuccess={(item) => applyColor(item.value)}
        />
      </Dropdown.Menu>
    </>
  );
};
