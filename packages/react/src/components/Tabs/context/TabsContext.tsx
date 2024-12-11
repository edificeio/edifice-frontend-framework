import { createContext, useContext } from 'react';

import { TabsItemProps } from '../components/TabsItem';

export interface TabsContextProps {
  activeTab?: string;
  items: TabsItemProps[];
  setSelectedTab: (key: string) => void;
  tabsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  tabUnderlineLeft: number;
  tabUnderlineWidth: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const TabsContext = createContext<TabsContextProps | null>(null!);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      `Tabs compound components cannot be rendered outside the Tabs component`,
    );
  }
  return context;
}
