import { ReactNode } from 'react';

import clsx from 'clsx';

import { TabsKidsItemProps } from './TabsKidsItem';
import TabsKidsList from './TabsKidsList';

const COMPACT_THRESHOLD = 3;

export interface TabsKidsProps {
  /**
   * Items to be displayed
   */
  items: TabsKidsItemProps[];
  /**
   * Identifier of the selected item (controlled)
   */
  activeId: string;
  /**
   * Get notified when an item is selected
   */
  onChange: (id: string) => void;
  /**
   * Content of the selected tab, rendered in a panel below the tab bar
   */
  children?: ReactNode;
  /**
   * Accessible name of the tab list
   */
  ariaLabel?: string;
  /**
   * Accessible name of the overflow dropdown trigger
   */
  overflowLabel?: string;
  /**
   * Additional class name
   */
  className?: string;
}

export const TabsKids = ({
  items,
  activeId,
  onChange,
  children,
  ariaLabel,
  overflowLabel,
  className,
}: TabsKidsProps) => {
  const hasActiveItem = items.some((item) => item.id === activeId);

  return (
    <div className={clsx('tabs-kids', className)}>
      {items.length > 1 && (
        <TabsKidsList
          items={items}
          activeId={activeId}
          onSelect={onChange}
          isCompact={items.length >= COMPACT_THRESHOLD}
          ariaLabel={ariaLabel}
          overflowLabel={overflowLabel}
        />
      )}
      {hasActiveItem && (
        <div
          id={`tabs-kids-panel-${activeId}`}
          role="tabpanel"
          aria-labelledby={`tabs-kids-${activeId}`}
          className="tabs-kids-panel"
        >
          {children}
        </div>
      )}
    </div>
  );
};

TabsKids.displayName = 'TabsKids';

export default TabsKids;
