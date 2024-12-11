import { ReactNode } from 'react';

import clsx from 'clsx';

const CardBody = ({
  children,
  space = null,
  flexDirection = 'row',
}: {
  space?: '0' | '8' | '16' | null;
  flexDirection?: 'row' | 'column' | null;
  children: ReactNode;
}) => {
  const cardbody = clsx('card-body', {
    [`p-${space}`]: space,
    [`gap-${space}`]: space,
    'align-items-start': flexDirection === 'column',
    'flex-column': flexDirection === 'column',
  });
  return <div className={cardbody}>{children}</div>;
};

CardBody.displayName = 'Card.Body';

export default CardBody;
