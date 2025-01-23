import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

import { IconSearch } from '../../modules/icons/components';
import { ButtonRef } from './Button';
import IconButton, { IconButtonProps } from './IconButton';

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
 * SearchButton extends the IconButton component by omitting unnecessary props.
 */
const SearchButton = forwardRef(
  (
    {
      icon = <IconSearch />,
      onClick,
      className,
      ...restProps
    }: SearchButtonProps,
    ref?: Ref<ButtonRef>,
  ) => {
    const classes = clsx('btn-search', className);

    return (
      <IconButton
        ref={ref}
        className={classes}
        icon={icon}
        onClick={onClick}
        {...restProps}
      />
    );
  },
);

SearchButton.displayName = 'SearchButton';

export default SearchButton;
