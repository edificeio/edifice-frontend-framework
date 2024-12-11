import { ReactNode } from 'react';

import clsx from 'clsx';

const CardTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const title = clsx(
    'card-title body text-break text-truncate text-truncate-2',
    className,
  );
  return (
    <h3 className={title}>
      <strong>{children}</strong>
    </h3>
  );
};

CardTitle.displayName = 'Card.Title';

export default CardTitle;
