import { MouseEvent, ReactNode } from 'react';

export interface PreventPropagationProps {
  /** Children Props */
  children: ReactNode;
}

const Root = ({ children }: PreventPropagationProps) => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return <div onClick={handleClick}>{children}</div>;
};

Root.displayName = 'PreventPropagation';

const PreventPropagation = Object.assign(Root, {});

export default PreventPropagation;
