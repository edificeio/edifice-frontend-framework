import { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="position-absolute badge rounded-pill bg-warning">
      {children}
    </span>
  );
}
