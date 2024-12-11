import { forwardRef, ReactNode, Ref } from 'react';

export interface VisuallyHiddenProps {
  children: ReactNode;
}

const VisuallyHidden = forwardRef(
  ({ children }: VisuallyHiddenProps, ref: Ref<HTMLSpanElement>) => {
    return (
      <span className="visually-hidden" ref={ref}>
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';

export default VisuallyHidden;
