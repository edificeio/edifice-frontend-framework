import { StringUtils } from '@edifice.io/utilities';
import clsx from 'clsx';
import { forwardRef, Ref } from 'react';
import { Button } from '../../components';
import { IconSee } from '../icons/components';

export interface ViewsCounterProps extends React.ComponentPropsWithRef<'button'> {
  /** The number of views to display. */
  viewsCounter: number;
}

const ViewsCounter = forwardRef(
  (
    { viewsCounter, onClick, className, ...restProps }: ViewsCounterProps,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onClick?.(event);
    };

    const isDisabled = viewsCounter <= 0;

    className = clsx('text-gray-700 fw-normal py-4 px-8 btn-icon', className);

    return (
      <Button
        ref={ref}
        rightIcon={<IconSee />}
        className={className}
        onClick={handleButtonClick}
        disabled={isDisabled}
        {...restProps}
        color="tertiary"
        variant="ghost"
      >
        {StringUtils.toCounter(viewsCounter)}
      </Button>
    );
  },
);

ViewsCounter.displayName = 'ViewsCounter';

export default ViewsCounter;
