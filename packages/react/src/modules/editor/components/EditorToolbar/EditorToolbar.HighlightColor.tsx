import { RefAttributes, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ColorPalette,
  ColorPicker,
  DefaultPalette,
  Dropdown,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '../../../../components';
import { useDropdownContext } from '../../../../components/Dropdown/DropdownContext';
import { IconTextHighlight } from '../../../icons/components';
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

export const EditorToolbarHighlightColor = ({
  triggerProps,
  itemRefs,
}: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();
  const { visible } = useDropdownContext();

  // Manage text and background colors.
  const [color, setColor] = useState<string>('#4A4A4A');

  // Triggered when the user chooses a highlighting color.
  const applyColor = useCallback(
    (value: string) => {
      // If the same color is picked, remove it (=toggle mode).
      if (value === color || value === '') {
        setColor('');
        editor?.chain().focus().unsetHighlight().run();
      } else {
        setColor(value);
        editor?.chain().focus().setHighlight({ color: value }).run();
      }
    },
    [color, editor],
  );

  // When cursor moves in table, update the current highlight color.
  useEffect(() => {
    setColor(editor?.getAttributes('customHighlight').color ?? '');
  }, [editor, editor?.state]);

  // Palettes of available colors to choose from.
  const palettes: ColorPalette[] = [
    {
      ...DefaultPalette,
      reset: {
        value: 'transparent',
        description: t('tiptap.toolbar.highlight.none'),
      },
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.toolbar.highlight.back')} placement="top">
        <IconButton
          {...triggerProps}
          type="button"
          variant="ghost"
          color="tertiary"
          icon={<IconTextHighlight />}
          aria-label={t('tiptap.toolbar.highlight.back')}
          className={visible ? 'is-selected' : ''}
        />
      </Tooltip>
      <Dropdown.Menu>
        <ColorPicker
          ref={(el: any) => (itemRefs.current['color-picker'] = el)}
          palettes={palettes}
          model={color}
          onSuccess={(item) => applyColor(item.value)}
        />
      </Dropdown.Menu>
    </>
  );
};
