import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

import commonPlaceholder from '@edifice.io/bootstrap/dist/images/common/image-placeholder.png';
import useImage from '../../hooks/useImage/useImage';

export interface ImageProps extends React.ComponentPropsWithRef<'img'> {
  /**
   * Image URL
   */
  src: string;
  /**
   * Alternative text for a11y
   */
  alt: string;
  /**
   * Image ratio
   */
  ratio?: '1' | '4' | '16' | '21';
  /**
   * Object fit property
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale' | 'none';
  /**
   * Placeholder image as fallback
   */
  imgPlaceholder?: string;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const Image = forwardRef(
  (
    {
      src,
      alt,
      imgPlaceholder,
      ratio,
      objectFit,
      className,
      ...restProps
    }: ImageProps,
    ref: Ref<HTMLImageElement>,
  ) => {
    const placeholder = imgPlaceholder ?? commonPlaceholder;

    const { imgSrc, onError } = useImage({ src, placeholder });

    const ratioImage = {
      'ratio ratio-1x1': ratio === '1',
      'ratio ratio-4x3': ratio === '4',
      'ratio ratio-16x9': ratio === '16',
      'ratio ratio-21x9': ratio === '21',
    };

    const objectImage = {
      'object-fit-contain': objectFit === 'contain',
      'object-fit-cover': objectFit === 'cover',
      'object-fit-fill': objectFit === 'fill',
      'object-fit-scale': objectFit === 'scale',
      'object-fit-none': objectFit === 'none',
    };

    const ratioClasses = clsx({
      ...ratioImage,
    });

    const classes = clsx(
      {
        ...objectImage,
      },
      className,
    );

    const renderImage = (
      <img
        alt={alt}
        onError={onError}
        ref={ref}
        src={imgSrc}
        className={classes}
        {...restProps}
      />
    );

    if (ratio) {
      return <div className={ratioClasses}>{renderImage}</div>;
    }

    return renderImage;
  },
);

Image.displayName = 'Image';

export default Image;
