import { ReactNode, useMemo } from 'react';

import { TabsContext } from '../context/TabsContext';
import { useTabs } from '../hooks/useTabs';
import TabsItem, { TabsItemProps } from './TabsItem';
import TabsList from './TabsList';
import TabsPanel from './TabsPanel';

export interface TabsProps {
  /**
   * Selected tab, by default.
   */
  defaultId?: string;
  /**
   * Items to be displayed
   */
  items: TabsItemProps[];
  /**
   * Get notified when a tab is selected
   */
  onChange?: (tab: TabsItemProps) => void;
  /**
   * Children Props
   */
  children?: (...props: any) => ReactNode;
  /**
   * Whether tabs should take full available width
   */
  fullWidth?: boolean;
  /**
   * Whether tabs should take full available height
   */
  fullHeight?: boolean;
  /**
   * Whether the tab list should be sticky
   */
  isSticky?: boolean;
  /**
   * The top offset for the sticky tab list
   */
  stickyTop?: number;
  /**
   * Additional class name for the tab header
   */
  headerClassName?: string;
  /**
   * Additional class name for the content area
   */
  contentClassName?: string;
}

/**
 * Tab Content displayed one at a time when a Tab Item is selected
 */
export const Tabs = ({
  defaultId,
  items,
  fullWidth = false,
  fullHeight = false,
  onChange,
  children,
  isSticky = false,
  stickyTop = 0,
  headerClassName,
  contentClassName,
}: TabsProps) => {
  const {
    activeTab,
    setSelectedTab,
    tabsRef,
    tabUnderlineLeft,
    tabUnderlineWidth,
    onKeyDown,
  } = useTabs({ defaultId, items, onChange });

  const value = useMemo(
    () => ({
      activeTab,
      items,
      setSelectedTab,
      tabsRef,
      tabUnderlineLeft,
      tabUnderlineWidth,
      onKeyDown,
    }),
    [
      activeTab,
      items,
      onKeyDown,
      setSelectedTab,
      tabUnderlineLeft,
      tabUnderlineWidth,
      tabsRef,
    ],
  );

  const currentItem = items.find((item) => item.id === activeTab);
  return (
    <TabsContext.Provider value={value}>
      {typeof children === 'function' ? (
        children(currentItem)
      ) : (
        <>
          <Tabs.List
            fullWidth={fullWidth}
            isSticky={isSticky}
            stickyTop={stickyTop}
            className={headerClassName}
          />
          <Tabs.Panel
            currentItem={currentItem}
            fullHeight={fullHeight}
            className={contentClassName}
          >
            {currentItem?.content}
          </Tabs.Panel>
        </>
      )}
    </TabsContext.Provider>
  );
};

Tabs.Item = TabsItem;
Tabs.Panel = TabsPanel;
Tabs.List = TabsList;

Tabs.displayName = 'Tabs';

export default Tabs;
