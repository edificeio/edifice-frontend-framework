import { ComponentPropsWithoutRef } from 'react';

import clsx from 'clsx';

import { useTabsContext } from '../context/TabsContext';
import Tabs from './Tabs';

export interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Whether tabs should take full available width
   */
  fullWidth?: boolean;
  /**
   * Whether the tab list should be sticky
   */
  isSticky?: boolean;
  /**
   * The top offset for the sticky tab list
   */
  stickyTop?: number;
}
const TabsList = (props: TabsListProps) => {
  const { items, tabUnderlineLeft, tabUnderlineWidth } = useTabsContext();
  const { className, fullWidth, isSticky, stickyTop, ...restProps } = props;

  const ulClasses = clsx('nav nav-tabs flex-nowrap', {
    'w-100': fullWidth,
  });

  const tabslist = clsx(
    ' flex-shrink-0 overflow-x-auto',
    {
      'position-sticky z-1': isSticky,
      'position-relative': !isSticky,
    },
    className,
  );

  return (
    <div
      className={tabslist}
      {...restProps}
      style={isSticky ? { top: stickyTop } : undefined}
    >
      <ul className={ulClasses} role="tablist">
        {items.map((item, order) => {
          return <Tabs.Item key={item.id} order={order} {...item}></Tabs.Item>;
        })}
        <span
          className="nav-slide"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </ul>
    </div>
  );
};

TabsList.displayName = 'Tabs.List';

export default TabsList;
