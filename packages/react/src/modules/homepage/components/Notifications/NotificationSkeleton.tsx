import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Skeleton, VisuallyHidden } from '../../../..';

export interface NotificationSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * How many lines the message is expected to wrap onto.
   *
   * This is the one dimension that cannot be derived from the component: it
   * depends on the length of a message that has not loaded yet. Two is the
   * common case, but a row whose message wraps onto three lines will shift by
   * one line box when the data arrives.
   */
  lines?: number;
}

/**
 * Loading placeholder for a single notification row.
 *
 * Mirrors the layout of `CommonNotificationItem` — same wrappers, same classes,
 * same gaps — and swaps each content slot for a `Skeleton` block, so the
 * placeholder occupies the space the loaded row will take.
 *
 * The blocks are sized by the `notification-item-skeleton-*` classes of
 * _skeleton.scss rather than by props, which keeps every dimension in the
 * stylesheet next to the component geometry it is derived from.
 */
const NotificationSkeleton = React.forwardRef<
  HTMLDivElement,
  NotificationSkeletonProps
>(({ lines = 2, ...restProps }, ref) => {
  const { t } = useTranslation();

  const lineCount = Math.max(1, lines);

  return (
    <Flex
      direction="column"
      className="notification-item"
      gap="8"
      role="status"
      aria-busy="true"
      ref={ref}
      {...restProps}
    >
      <VisuallyHidden>
        {t('homepage.notifications-list.loading')}
      </VisuallyHidden>
      <Flex direction="row" gap="8">
        <div className="notification-item-picture">
          <Skeleton
            variant="circle"
            tone="strong"
            className="notification-item-avatar"
          />
        </div>
        {/* The real row wraps this column in an anchor, which is blockified as
            a flex item. `fill` gives the column the remaining width so the
            percentage-sized blocks resolve against it. */}
        <Flex direction="column" gap="8" fill>
          <div className="notification-item-message skeleton-lines">
            {Array.from({ length: lineCount }, (_, index) => (
              <Skeleton
                key={index}
                variant="text"
                className="notification-item-skeleton-line"
              />
            ))}
          </div>
          <Skeleton
            variant="pill"
            className="notification-item-skeleton-chip"
          />
          <Skeleton
            variant="text"
            className="notification-item-skeleton-date"
          />
        </Flex>
      </Flex>
    </Flex>
  );
});

NotificationSkeleton.displayName = 'NotificationSkeleton';

export default NotificationSkeleton;
