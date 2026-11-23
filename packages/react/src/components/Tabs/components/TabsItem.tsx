import { ReactNode } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useTabsContext } from '../context/TabsContext';

export interface TabsItemProps {
  /**
   * Item identifier
   */
  id: string;
  /**
   * Item icon
   */
  icon: ReactNode;
  /**
   * Item badge
   */
  badge?: ReactNode;
  /**
   * Item label
   */
  label: string;
  /**
   * Item content, to be displayed in the panel when selected.
   */
  content: ReactNode;
  /**
   * Test identifier set on the tab button
   */
  ['data-testid']?: string;
}

const TabsItem = ({
  icon,
  badge,
  label,
  id,
  order,
  'data-testid': dataTestId,
}: TabsItemProps & { order: number }) => {
  const { activeTab, setSelectedTab, onKeyDown, tabsRef } = useTabsContext();
  const { t } = useTranslation();

  const classes = clsx(
    'nav-link d-inline-flex gap-8 border-0',
    activeTab === id ? 'selected' : '',
  );

  return (
    <li className="nav-item flex-shrink-0" role="presentation">
      <button
        ref={(el) => (tabsRef.current[order] = el)}
        type="button"
        id={`tab-${id}`}
        data-testid={dataTestId}
        className={classes}
        onClick={() => setSelectedTab(id)}
        onKeyDown={(event) => onKeyDown(event)}
        role="tab"
        aria-controls={`tabpanel-${id}`}
        aria-selected={activeTab === id}
        tabIndex={activeTab === id ? 0 : -1}
      >
        {icon}
        <small>
          {t(label)} {badge}
        </small>
      </button>
    </li>
  );
};

TabsItem.displayName = 'Tabs.Item';

export default TabsItem;
