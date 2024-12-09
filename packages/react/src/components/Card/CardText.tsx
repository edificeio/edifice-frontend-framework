import { ReactNode } from 'react';

import clsx from 'clsx';

const CardText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const text = clsx(
    'card-text small text-break text-truncate text-truncate-1',
    className,
  );
  return <p className={text}>{children}</p>;
};

CardText.displayName = 'Card.Text';

export default CardText;
