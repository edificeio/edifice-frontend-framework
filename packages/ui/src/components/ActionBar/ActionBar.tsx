import { forwardRef, Ref } from 'react';

export interface ActionBarProps {
  /**
   * Add Buttons To Actions bar
   */
  children: React.ReactNode;
}

export type ActionBarType = React.FC<ActionBarProps>;

const ActionBar = forwardRef(
  ({ children }: ActionBarProps, ref: Ref<HTMLDivElement>) => {
    return (
      <div ref={ref} className="actionbar">
        {children}
      </div>
    );
  },
);

ActionBar.displayName = 'ActionBar';
export default ActionBar;
