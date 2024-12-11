import { ReactNode } from 'react';

import { useTabsContext } from '../context/TabsContext';
import { TabsItemProps } from './TabsItem';

export interface TabsPanelProps {
  /**
   * Content of the item
   */
  children: ReactNode;
  /**
   * Current Item
   */
  currentItem: TabsItemProps | undefined;
}

const TabsPanel = ({ children, currentItem }: TabsPanelProps) => {
  const { activeTab } = useTabsContext();

  return (
    <div className="tab-content d-flex flex-fill w-100">
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
