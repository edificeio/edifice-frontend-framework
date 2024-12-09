import { forwardRef, ReactNode, Ref } from 'react';

import clsx from 'clsx';
import { IconLoader } from '../../modules/icons/components';

export type LoadingPosition = 'left' | 'right' | undefined;
export type LoadingIcon = JSX.Element | undefined;

export interface LoadingProps {
  /**
   * Is it loading ?
   */
  isLoading: boolean;
  /**
   * Override default loading icon
   */
  loadingIcon?: LoadingIcon;
  /**
   * Default position to left. When using with another component, position can be switched
   */
  loadingPosition?: LoadingPosition;
  /** When using with another component, we can pass a children */
  children?: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;

  color?: string;
}

/**
 * Inform user about loading status
 */

const Loading = forwardRef(
  (props: LoadingProps, ref: Ref<HTMLDivElement>): JSX.Element => {
    const {
      isLoading,
      loadingIcon,
      loadingPosition = 'left',
      children,
      className,
      ...restProps
    } = props;

    const getLoadingIcon = () => {
      let icon;
      if (loadingIcon) {
        icon = loadingIcon;
      } else {
        icon = <IconLoader {...restProps} aria-label="Loading" />;
      }

      return icon;
    };

    const classes = clsx(
      'loading d-flex align-items-center gap-8',
      {
        'is-loading': isLoading,
      },
      className,
    );

    return (
      <div className={classes} role="status" ref={ref}>
        {(!loadingPosition || loadingPosition === 'left') && getLoadingIcon()}
        {children}
        {loadingPosition === 'right' && getLoadingIcon()}
      </div>
    );
  },
);

Loading.displayName = 'Loading';

export default Loading;
