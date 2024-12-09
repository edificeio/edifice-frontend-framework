import { ComponentPropsWithoutRef } from 'react';

import clsx from 'clsx';

import { useTabsContext } from '../context/TabsContext';
import Tabs from './Tabs';

const TabsList = (props: ComponentPropsWithoutRef<'div'>) => {
  const { items, tabUnderlineLeft, tabUnderlineWidth } = useTabsContext();
  const { className, ...restProps } = props;

  const tabslist = clsx(
    'position-relative flex-shrink-0 overflow-x-auto',
    className,
  );
  return (
    <div className={tabslist} {...restProps}>
      <ul className="nav nav-tabs flex-nowrap" role="tablist">
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
