import {
  ComponentPropsWithRef,
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  IconAlertCircle,
  IconError,
  IconInfoCircle,
  IconSuccessOutline,
} from '../../modules/icons/components';
import { Button } from '../Button';

export interface AlertRef {
  show: () => void;
  hide: () => void;
}

export type AlertTypes = 'success' | 'warning' | 'info' | 'danger';

export type AlertPosition =
  | 'none'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface AlertProps extends ComponentPropsWithRef<'div'> {
  /**
   * Type of alert
   */
  type?: AlertTypes;

  /**
   * Alert can be closed with a button ?
   */
  isDismissible?: boolean;

  /**
   * Alert is displayed as Toast
   */
  isToast?: boolean;

  /**
   * Alert is displayed as a confirm box (cancel button and confirm button)
   */
  isConfirm?: boolean;

  /**
   * Alert poistion.
   */
  position?: AlertPosition;

  /**
   * Alert must close after delay
   */
  autoClose?: boolean;

  /**
   * If autoClose if activated, set the delay
   * Défault : 3000
   */
  autoCloseDelay?: number;

  /**
   * Alert box content
   */
  children: ReactNode;

  /**
   * Alert box action
   */
  button?: ReactNode;

  /**
   * Callback when alert is closed
   */
  onClose?: () => void;

  /**
   * Callback when alert is closed
   */
  onVisibilityChange?: (isVisible: boolean) => void;

  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const Alert = forwardRef(
  (
    {
      type = 'success',
      className = '',
      children,
      button,
      isDismissible = false,
      isToast = false,
      isConfirm = false,
      position = 'none',
      autoClose = false,
      autoCloseDelay = 3000,
      onClose,
      onVisibilityChange,
    }: AlertProps,
    ref: Ref<AlertRef>,
  ) => {
    const [isVisible, setVisibleStatus] = useState<boolean>(true);

    // Local ref will be merged with forwardRef in useImperativeHandle below
    const refAlert = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    // Method to hide alert
    const hide = useCallback(() => {
      setVisibleStatus(false);
      // The parent component can execute function when alert is closed
      onClose?.();
    }, [onClose]);

    // We add two methods to control the alert from parent component
    useImperativeHandle(ref, () => ({
      show,
      hide,
      ...(refAlert.current as HTMLDivElement),
    }));

    // The parent component can get alert visible state
    useLayoutEffect(() => {
      onVisibilityChange?.(isVisible);
    }, [isVisible, onVisibilityChange]);

    useEffect(() => {
      if (autoClose && isVisible) {
        setTimeout(() => {
          hide();
        }, autoCloseDelay);
      }
    }, [autoClose, autoCloseDelay, hide, isVisible]);

    // Method to show alert
    const show = () => {
      setVisibleStatus(true);
    };

    // Here we are mapping alert type with icon Component and bootstrap class
    // https://getbootstrap.com/docs/5.2/components/alerts/
    const mapping = {
      success: { icon: <IconSuccessOutline />, classModifier: 'alert-success' },
      warning: { icon: <IconAlertCircle />, classModifier: 'alert-warning' },
      info: { icon: <IconInfoCircle />, classModifier: 'alert-info' },
      danger: { icon: <IconError />, classModifier: 'alert-danger' },
    };

    // Create className Attribute from component parameters
    const toastClasses = {
      'is-dismissible': isDismissible,
      'is-toast ': isToast,
    };
    // class for Confirm box style
    const confirmClasses = {
      'is-confirm': isConfirm,
    };

    const divContainerClasses = clsx(
      'alert gap-12',
      mapping[type].classModifier,
      toastClasses,
      confirmClasses,
      position,
      className,
    );

    return (
      <>
        {isVisible ? (
          <div ref={refAlert} className={divContainerClasses} role="alert">
            {!isConfirm && mapping[type].icon}
            <div className="alert-content small">{children}</div>
            {button && (
              <div className="ms-12">
                {button}{' '}
                {isConfirm && <Button onClick={hide}>{t('close')}</Button>}
              </div>
            )}
            {(isDismissible || isConfirm) && (
              <div className="btn-close-container">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label={t('close')}
                  onClick={hide}
                ></button>
              </div>
            )}
            {/* Waiting animation library */}
            {autoClose && (
              <div
                className="alert-progress"
                style={{
                  transform: `scaleX(0)`,
                }}
              ></div>
            )}
          </div>
        ) : null}
      </>
    );
  },
);

Alert.displayName = 'Alert';

export default Alert;
