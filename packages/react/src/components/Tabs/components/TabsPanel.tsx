import { ReactNode } from 'react';

import { useTabsContext } from '../context/TabsContext';
import { TabsItemProps } from './TabsItem';
import clsx from 'clsx';

export interface TabsPanelProps {
  /**
   * Content of the item
   */
  children: ReactNode;
  /**
   * Current Item
   */
  currentItem: TabsItemProps | undefined;
  /**
   * Whether tabs should take full available height
   */
  fullHeight?: boolean;
}

const TabsPanel = ({ children, currentItem, fullHeight }: TabsPanelProps) => {
  const { activeTab } = useTabsContext();
  const contentClasses = clsx('tab-content d-flex flex-fill w-100', {
    'position-relative h-100': fullHeight,
  });

  return (
    <div className={contentClasses}>
      <div
        className={`tab-pane flex-fill w-100 fade ${
          activeTab === currentItem?.id ? 'show active' : ''
        }`}
        id={`tabpanel-${currentItem?.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentItem?.id}`}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};

TabsPanel.displayName = 'Tabs.Panel';

export default TabsPanel;
