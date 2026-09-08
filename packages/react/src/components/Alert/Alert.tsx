import {
  ComponentPropsWithRef,
  CSSProperties,
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
  IconAlertTriangle,
  IconClose,
  IconError,
  IconInfoCircle,
  IconSuccessOutline,
} from '../../modules/icons/components';
import { ButtonBeta as Button } from '../ButtonBeta';

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

// Kept in sync with the animation-duration set on .is-toast in _alert.scss:
// the exit animation must finish playing before the toast actually unmounts
const TOAST_EXIT_ANIMATION_DURATION = 240;

// A toast slides in/out from the side it's anchored to, and simply fades otherwise
const getToastAnimationClass = (
  position: AlertPosition,
  isClosing: boolean,
) => {
  if (position === 'top-left' || position === 'bottom-left') {
    return isClosing ? 'alert-slide-out-left' : 'alert-slide-in-left';
  }
  if (position === 'top-right' || position === 'bottom-right') {
    return isClosing ? 'alert-slide-out-right' : 'alert-slide-in-right';
  }
  return isClosing ? 'alert-fade-out' : 'alert-fade-in';
};

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
    // Toasts stay mounted while their exit animation plays; other alerts close immediately
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // Local ref will be merged with forwardRef in useImperativeHandle below
    const refAlert = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    // Method to hide alert
    const hide = useCallback(() => {
      if (isToast) {
        setIsClosing(true);
        return;
      }
      setVisibleStatus(false);
      // The parent component can execute function when alert is closed
      onClose?.();
    }, [isToast, onClose]);

    // Keep the toast mounted for as long as its exit animation plays, then unmount it.
    // A timer is used rather than the animationend event so this stays reliable
    // regardless of reduced-motion settings or the test environment.
    useEffect(() => {
      if (!isClosing) {
        return;
      }
      const timeoutId = setTimeout(() => {
        setVisibleStatus(false);
        onClose?.();
      }, TOAST_EXIT_ANIMATION_DURATION);

      return () => clearTimeout(timeoutId);
    }, [isClosing, onClose]);

    // Toasts can be dismissed by clicking anywhere on them, except on their actions
    const handleToastClick = () => {
      if (isToast && !isConfirm) {
        hide();
      }
    };

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

    const shouldAutoClose = autoClose && isVisible && !isClosing;
    const showProgress = autoClose && isToast && !isDismissible && !isClosing;

    // Remaining delay and pause/resume bookkeeping for the auto-close timer,
    // kept in refs so mouseenter/mouseleave don't need to re-run the effect below
    const remainingRef = useRef(autoCloseDelay);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const startedAtRef = useRef(0);
    const [isPaused, setIsPaused] = useState(false);

    const clearAutoCloseTimeout = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    }, []);

    useEffect(() => {
      if (!shouldAutoClose) {
        return;
      }

      remainingRef.current = autoCloseDelay;
      startedAtRef.current = Date.now();
      timeoutRef.current = setTimeout(hide, autoCloseDelay);

      return clearAutoCloseTimeout;
    }, [shouldAutoClose, autoCloseDelay, hide, clearAutoCloseTimeout]);

    // Pausing on hover mirrors the pause-on-hover behavior react-hot-toast used to provide;
    // now that Alert owns the auto-close timer, it must reimplement it itself
    const handleMouseEnter = () => {
      if (!shouldAutoClose || isPaused) {
        return;
      }
      clearAutoCloseTimeout();
      remainingRef.current = Math.max(
        remainingRef.current - (Date.now() - startedAtRef.current),
        0,
      );
      setIsPaused(true);
    };

    const handleMouseLeave = () => {
      if (!shouldAutoClose || !isPaused) {
        return;
      }
      startedAtRef.current = Date.now();
      timeoutRef.current = setTimeout(hide, remainingRef.current);
      setIsPaused(false);
    };

    // Method to show alert
    const show = () => {
      // Reset the leftover closing state from a previous dismissal, otherwise
      // the toast would re-mount playing its exit animation instead of entering
      setIsClosing(false);
      setVisibleStatus(true);
    };

    // Here we are mapping alert type with icon Component and bootstrap class
    // https://getbootstrap.com/docs/5.2/components/alerts/
    const mapping = {
      success: { icon: <IconSuccessOutline />, classModifier: 'alert-success' },
      warning: { icon: <IconAlertTriangle />, classModifier: 'alert-warning' },
      info: { icon: <IconInfoCircle />, classModifier: 'alert-info' },
      danger: { icon: <IconError />, classModifier: 'alert-danger' },
    };

    // Create className Attribute from component parameters
    const toastClasses = {
      'is-dismissible': isDismissible,
      'is-toast': isToast,
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
      isToast && getToastAnimationClass(position, isClosing),
      className,
    );

    return (
      <>
        {isVisible ? (
          <div
            ref={refAlert}
            className={divContainerClasses}
            role="alert"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleToastClick}
          >
            {!isConfirm && mapping[type].icon}
            <div className="alert-content small flex-grow-1">{children}</div>
            {button && (
              <div
                className="alert-actions"
                onClick={(e) => e.stopPropagation()}
              >
                {button}
                {isConfirm && <Button onClick={hide}>{t('close')}</Button>}
              </div>
            )}
            {(isDismissible || isConfirm) && (
              <div
                className="btn-close-container"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="button"
                  leftIcon={<IconClose />}
                  variant="ghost"
                  color="tertiary"
                  aria-label={t('close')}
                  title={t('close')}
                  onClick={hide}
                />
              </div>
            )}
            {showProgress && (
              <div
                className={clsx('alert-progress', { 'is-paused': isPaused })}
                style={
                  {
                    '--alert-progress-duration': `${autoCloseDelay}ms`,
                  } as CSSProperties
                }
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
