/**
 * Button  Component
 *
 * @see Docs     https://edifice-frontend-framework.vercel.app/?path=/docs/components-core-button--base
 * @see Source   https://github.com/opendigitaleducation/edifice-frontend-framework/blob/main/packages/core/src/Button/Button.tsx
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
import { forwardRef, Ref } from 'react';

import clsx from 'clsx';
import { Search } from '../../../../icons/dist';

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
    { icon = <Search />, onClick, className, ...restProps }: SearchButtonProps,
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
