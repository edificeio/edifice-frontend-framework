import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

import { IconSearch } from '../../modules/icons/components';
import { ButtonBeta } from '../ButtonBeta';
import { ButtonRef } from './Button';
import { IconButtonProps } from './IconButton';

type PickedProps = 'type' | 'icon' | 'size';

export interface SearchButtonProps extends Pick<IconButtonProps, PickedProps> {
  /**
   * OnClick Handler
   */
  onClick?: () => void;
  /**
   * Disabled state of Search Button
   */
  disabled?: boolean;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Icon-only search button built on ButtonBeta.
 */
const SearchButton = forwardRef(
  (
    { icon = <IconSearch />, onClick, className, disabled }: SearchButtonProps,
    ref?: Ref<ButtonRef>,
  ) => {
    const classes = clsx('btn-search', className);

    return (
      // <IconButton
      //   ref={ref}
      //   className={classes}
      //   icon={icon}
      //   onClick={onClick}
      //   {...restProps}
      // />
      <ButtonBeta
        ref={ref}
        className={classes}
        leftIcon={icon}
        size={'md'}
        onClick={onClick}
        disabled={disabled}
      />
    );
  },
);

SearchButton.displayName = 'SearchButton';

export default SearchButton;
