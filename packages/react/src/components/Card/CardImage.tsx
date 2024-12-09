import clsx from 'clsx';

import { useCardContext } from './CardContext';
import { AppIcon } from '../AppIcon';
import { Image } from '../Image';

const CardImage = ({
  imageSrc,
  className,
  variant = 'medium',
}: {
  imageSrc?: string | undefined;
  className?: string;
  variant?: 'small' | 'medium' | 'landscape';
}) => {
  const { app } = useCardContext();

  const style =
    variant === 'landscape'
      ? {
          width: '100%',
          height: 'auto',
        }
      : null;

  return (
    <div className={clsx('card-image', variant)}>
      {imageSrc ? (
        <Image
          alt=""
          src={imageSrc}
          objectFit="cover"
          className={clsx('h-full w-100', className)}
        />
      ) : (
        <AppIcon
          app={app}
          iconFit="ratio"
          size="80"
          variant="rounded"
          {...style}
        />
      )}
    </div>
  );
};

CardImage.displayName = 'Card.Image';

export default CardImage;
