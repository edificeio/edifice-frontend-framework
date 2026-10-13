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
   * Display the tab bar, even with a single item. When hidden, only the panel
   * of the active item is rendered (e.g. for a student viewing their own data)
   * @default true
   */
  showTabBar?: boolean;
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
  showTabBar = true,
  ariaLabel,
  overflowLabel,
  className,
}: TabsKidsProps) => {
  const hasTabs = showTabBar && items.length > 0;
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className={clsx('tabs-kids', className)}>
      {hasTabs && (
        <TabsKidsList
          items={items}
          activeId={activeId}
          onSelect={onChange}
          isCompact={items.length >= COMPACT_THRESHOLD}
          ariaLabel={ariaLabel}
          overflowLabel={overflowLabel}
        />
      )}
      {activeItem && (
        <div
          id={hasTabs ? `tabs-kids-panel-${activeId}` : undefined}
          role={hasTabs ? 'tabpanel' : 'region'}
          aria-labelledby={hasTabs ? `tabs-kids-${activeId}` : undefined}
          aria-label={hasTabs ? undefined : activeItem.label}
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
