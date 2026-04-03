import { createContext, useContext } from 'react';

export type PageLayoutVariant = 'centered' | 'fullpage';
export type PageLayoutScrollMode = 'columns' | 'page';

export interface NoPaddingConfig {
  sidebarLeft?: boolean;
  content?: boolean;
  sidebarRight?: boolean;
}

export interface PageLayoutContextValue {
  variant: PageLayoutVariant;
  scrollMode?: PageLayoutScrollMode;
  noPadding?: NoPaddingConfig;
}

export const PageLayoutContext = createContext<PageLayoutContextValue>({
  variant: 'centered',
});

export const usePageLayout = () => useContext(PageLayoutContext);
