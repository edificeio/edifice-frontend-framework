import { TooltipProps } from '../Tooltip';

export interface ColorPaletteItem {
  /**
   * CSS Color Value, in the form #AABBCC
   */
  value: string;
  /**
   * i18n key describing the color.
   */
  description: string;
  /**
   * Is it a dark or light color ?
   * When undefined, will be considered Dark.
   */
  hue?: 'dark' | 'light';
  /**
   * Is it intended to be a reset color ?
   */
  isReset?: boolean;
}

/** Variations of one color. */
export type ColorPaletteHues = Array<ColorPaletteItem>;

export interface ColorPalette {
  /**
   * Description of the color palette.
   */
  label: string;
  /**
   * [Optional] informative tooltip.
   */
  tooltip?: Partial<TooltipProps>;
  /**
   * Array of colors * variations.
   */
  colors: ColorPaletteHues[];
  /**
   * Reset option
   */
  reset?: ColorPaletteItem;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

export const DefaultPalette: ColorPalette = {
  className: 'fw-bold',
  label: 'defaultPalette',
  colors: [
    /* Paint It Black */
    [
      { value: '#4A4A4A', description: 'color.gray.darkest' },
      { value: '#909090', description: 'color.gray.dark' },
      { value: '#C7C7C7', description: 'color.gray.medium' },
      { value: '#F2F2F2', description: 'color.gray.light', hue: 'light' },
      { value: '#FFFFFF', description: 'color.white', hue: 'light' },
    ],
    /* Blue Sunday */
    [
      { value: '#005A8A', description: 'color.blue.darkest' },
      { value: '#2F7EA7', description: 'color.blue.dark' },
      { value: '#46AFE6', description: 'color.blue.medium' },
      { value: '#B9E3F8', description: 'color.blue.light', hue: 'light' },
      { value: '#E5F5FF', description: 'color.blue.lightest', hue: 'light' },
    ],
    /* Purple haze */
    [
      { value: '#550070', description: 'color.purple.darkest' },
      { value: '#7C2C96', description: 'color.purple.dark' },
      { value: '#A348C0', description: 'color.purple.medium' },
      { value: '#D7B5E2', description: 'color.purple.light', hue: 'light' },
      { value: '#F6ECF9', description: 'color.purple.lightest', hue: 'light' },
    ],
    /* Red House */
    [
      { value: '#9E0016', description: 'color.red.darkest' },
      { value: '#C6253B', description: 'color.red.dark' },
      { value: '#FF3A55', description: 'color.red.medium' },
      { value: '#FFB6C0', description: 'color.red.light', hue: 'light' },
      { value: '#FFECEE', description: 'color.red.lightest', hue: 'light' },
    ],
    /* The Brown Album */
    [
      { value: '#9E4800', description: 'color.brown.darkest' },
      { value: '#DA6A0B', description: 'color.brown.dark' },
      { value: '#FF8D2E', description: 'color.brown.medium' },
      { value: '#FFCBA0', description: 'color.brown.light', hue: 'light' },
      { value: '#FFEFE3', description: 'color.brown.lightest', hue: 'light' },
    ],
    /* Yellow Submarine */
    [
      { value: '#A89400', description: 'color.yellow.darkest' },
      { value: '#D1AF00', description: 'color.yellow.dark' },
      { value: '#F1CA00', description: 'color.yellow.medium' },
      { value: '#FAEA9C', description: 'color.yellow.light', hue: 'light' },
      { value: '#FBF4D5', description: 'color.yellow.lightest', hue: 'light' },
    ],
    /* Green Naugahyde */
    [
      { value: '#2E6105', description: 'color.green.darkest' },
      { value: '#4E9019', description: 'color.green.dark' },
      { value: '#5AC235', description: 'color.green.medium' },
      { value: '#C8E4AF', description: 'color.green.light', hue: 'light' },
      { value: '#EAF7E4', description: 'color.green.lightest', hue: 'light' },
    ],
  ],
};

export const AccessiblePalette: ColorPalette = {
  label: 'accessiblePalette',
  tooltip: { message: 'Veni, vidi, vici' },
  colors: [
    [{ value: '#4A4A4A', description: 'color.gray' }],
    [{ value: '#648FFF', description: 'color.blue' }],
    [{ value: '#785EF0', description: 'color.purple' }],
    [{ value: '#DC267F', description: 'color.red' }],
    [{ value: '#FE6100', description: 'color.brown' }],
    [{ value: '#FFB000', description: 'color.orange' }],
    [{ value: '#F3EA14', description: 'color.yellow' }],
  ],
  className: 'mt-16',
};
