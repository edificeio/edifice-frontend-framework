import { ComponentPropsWithRef, forwardRef, Ref } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  IconDeleteColor,
  IconInfoCircle,
} from '../../modules/icons/components';
import { Tooltip } from '../Tooltip';
import {
  AccessiblePalette,
  ColorPalette,
  ColorPaletteHues,
  ColorPaletteItem,
  DefaultPalette,
} from './ColorPalette';
import ColorPickerItem from './ColorPickerItem';

export interface ColorPickerProps extends ComponentPropsWithRef<'div'> {
  /**
   * Palettes of pickable colors
   */
  palettes?: ColorPalette[];

  /**
   * Current picked color
   */
  model?: string;

  /**
   * Triggered when a color is picked
   */
  onSuccess?: (item: ColorPaletteItem) => void;
}

const ColorPicker = forwardRef(
  (
    {
      palettes = [DefaultPalette, AccessiblePalette],
      model = '#4A4A4A',
      onSuccess,
      ...restProps
    }: ColorPickerProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { t } = useTranslation();
    const handleClick = (item?: ColorPaletteItem) => {
      item && onSuccess?.(item);
    };

    return (
      <div ref={ref} {...restProps}>
        {palettes.map((palette: ColorPalette, paletteIdx) => (
          <div
            key={paletteIdx}
            className={clsx('color-picker mx-8', palette.className)}
          >
            <div className="color-picker-label small mt-4 mb-8">
              {t(palette.label)}
              {palette.tooltip && (
                <Tooltip message="" placement="auto" {...palette.tooltip}>
                  <IconInfoCircle
                    width={18}
                    height={18}
                    className="mx-4 position-relative"
                    style={{ top: '4px' }}
                  />
                </Tooltip>
              )}
            </div>

            {
              // Show/hide the reset option
              palette.reset && (
                <button
                  type="button"
                  className="color-picker-reset small my-8 gap-4"
                  onClick={() => handleClick(palette.reset)}
                >
                  <IconDeleteColor width={20} height={20} />
                  {palette.reset.description}
                </button>
              )
            }

            <div className="color-picker-palette d-flex gap-2 justify-content-between">
              {palette.colors.map((hues: ColorPaletteHues, hueIndex) => (
                <div
                  key={hueIndex}
                  className="color-picker-hue d-flex gap-2 justify-content-between flex-column "
                >
                  {hues.map((color) => (
                    <button
                      type="button"
                      key={color.value}
                      aria-label={color.description}
                      className="color-picker-hue-color"
                      onClick={() => handleClick(color)}
                    >
                      <ColorPickerItem
                        {...restProps}
                        model={color}
                        selected={model === color.value}
                      />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
