import { ReactNode } from 'react';

const CardFooter = ({ children }: { children: ReactNode }) => {
  return <div className="card-footer gap-16">{children}</div>;
};

CardFooter.displayName = 'Card.Footer';

export default CardFooter;
