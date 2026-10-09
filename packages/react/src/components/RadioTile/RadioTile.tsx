import {
  CSSProperties,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';

import clsx from 'clsx';

export interface RadioTileProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'className' | 'style'
> {
  /**
   * Label of the tile. Also used as the accessible name of the radio input.
   */
  label: ReactNode;
  /**
   * Optional image: an URL, or any React node (e.g. a background preview).
   */
  image?: string | ReactNode;
  /**
   * Layout of a tile with both an image and a label.
   * Ignored when there is no image or when the label is hidden.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Visually hide the label (it stays available to screen readers).
   * Use it with an `image` to render an image-only tile.
   */
  hideLabel?: boolean;
  /**
   * Additional CSS class names applied to the tile (root element).
   */
  className?: string;
  /**
   * Inline styles applied to the tile (root element).
   */
  style?: CSSProperties;
}

/**
 * A radio input presented as a selectable tile, with a label, an image or both.
 * Group tiles together by giving them the same `name`.
 */
const RadioTile = forwardRef(
  (
    {
      label,
      image,
      orientation = 'horizontal',
      hideLabel = false,
      className,
      style,
      ...inputProps
    }: RadioTileProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const hasImage = image !== undefined && image !== null && image !== false;

    const layout = !hasImage
      ? 'text'
      : hideLabel
        ? 'image'
        : orientation === 'vertical'
          ? 'vertical'
          : 'horizontal';

    return (
      <label
        className={clsx('radio-tile', `radio-tile--${layout}`, className)}
        style={style}
      >
        <input
          ref={ref}
          type="radio"
          className="radio-tile__input visually-hidden"
          {...inputProps}
        />
        {hasImage && (
          <span className="radio-tile__image">
            {typeof image === 'string' ? (
              <img src={image} alt="" loading="lazy" />
            ) : (
              image
            )}
          </span>
        )}
        <span
          className={clsx('radio-tile__label', hideLabel && 'visually-hidden')}
        >
          {label}
        </span>
      </label>
    );
  },
);

RadioTile.displayName = 'RadioTile';

export default RadioTile;
