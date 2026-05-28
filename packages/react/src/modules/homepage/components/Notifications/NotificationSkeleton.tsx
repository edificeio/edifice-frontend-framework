import React from 'react';

const NotificationSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div className="placeholder py-24 mb-16" ref={ref}></div>);

NotificationSkeleton.displayName = 'NotificationSkeleton';

export default NotificationSkeleton;
