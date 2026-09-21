import { CSSProperties, forwardRef, Ref } from 'react';

import clsx from 'clsx';

export type SkeletonVariant = 'text' | 'circle' | 'pill' | 'block';
export type SkeletonTone = 'default' | 'strong';
export type SkeletonAnimation = 'static' | 'pulse' | 'shimmer';

export interface SkeletonProps extends Omit<
  React.ComponentPropsWithRef<'div'>,
  'children'
> {
  /**
   * Geometry of the block.
   * `text` and `block` use the `sm` radius, `circle` is a perfect circle whose
   * missing dimension mirrors the provided one, `pill` is fully rounded.
   */
  variant?: SkeletonVariant;
  /**
   * Grey level.
   * `default` (grey/300) stands for text slots, `strong` (grey/500) for media
   * slots such as avatars and thumbnails.
   */
  tone?: SkeletonTone;
  /**
   * Loading animation. Always suppressed when the user asked for reduced
   * motion, whatever the value passed here.
   */
  animation?: SkeletonAnimation;
  /**
   * Width of the block, a number being read as pixels. Left out, the stylesheet
   * fills the parent so an unsized block never collapses.
   *
   * Prefer sizing a component variant through a class: passing dimensions here
   * puts them in a style attribute, away from the component geometry they are
   * derived from.
   */
  width?: number | string;
  /**
   * Height of the block, a number being read as pixels. Same caveat as `width`.
   */
  height?: number | string;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const toCssSize = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

/**
 * Geometric placeholder standing in for a piece of content while it loads.
 *
 * The primitive carries no loading logic and no children: a component declares
 * its own skeleton variant by reusing its real layout and swapping each content
 * slot for one of these blocks, which is what keeps the placeholder free of
 * layout shift.
 *
 * It is decorative and hidden from assistive technologies. The component
 * assembling the blocks owns `role="status"` and `aria-busy`, so the loading
 * state is announced once instead of once per block.
 */
const Skeleton = forwardRef(
  (
    {
      variant = 'text',
      tone = 'default',
      animation = 'static',
      width,
      height,
      className,
      style,
      ...restProps
    }: SkeletonProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const classes = clsx(
      'skeleton',
      `skeleton-${variant}`,
      {
        'skeleton-strong': tone === 'strong',
        'skeleton-pulse': animation === 'pulse',
        'skeleton-shimmer': animation === 'shimmer',
      },
      className,
    );

    // The full-width fallback and the circle's aspect ratio live in the
    // stylesheet, so a block sized by a class emits no style attribute at all.
    const sized = width !== undefined || height !== undefined || style;
    const sizes: CSSProperties | undefined = sized
      ? { width: toCssSize(width), height: toCssSize(height), ...style }
      : undefined;

    return (
      <div
        ref={ref}
        className={classes}
        style={sizes}
        {...restProps}
        aria-hidden="true"
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
