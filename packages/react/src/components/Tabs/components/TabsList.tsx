import { ComponentPropsWithoutRef } from 'react';

import clsx from 'clsx';

import { useTabsContext } from '../context/TabsContext';
import Tabs from './Tabs';

export interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Whether tabs should take full available width
   */
  fullWidth?: boolean;
}
const TabsList = (props: TabsListProps) => {
  const { items, tabUnderlineLeft, tabUnderlineWidth } = useTabsContext();
  const { className, ...restProps } = props;

  const ulClasses = clsx('nav nav-tabs flex-nowrap', {
    'w-100': props.fullWidth,
  });

  const tabslist = clsx(
    'position-relative flex-shrink-0 overflow-x-auto',
    className,
  );
  return (
    <div className={tabslist} {...restProps}>
      <ul className={ulClasses} role="tablist">
        {items.map((item, order) => {
          return <Tabs.Item key={item.id} order={order} {...item}></Tabs.Item>;
        })}
      </ul>
      <span
        className="nav-slide"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      />
    </div>
  );
};

TabsList.displayName = 'Tabs.List';

export default TabsList;
