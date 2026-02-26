import type { ReactNode } from 'react';
import { Visible } from './visible';

export interface UserSearchProps {
  placeholder?: string;
  isAdmlcOrAdmc?: boolean;
  bookmarks?: Visible[];
  initialSharings?: SharingItem[];
  getSearchResults: (searchInputValue: string) => Promise<SearchResponse>;
  onSearchResultsChange?: (searchResult: Visible) => void;
}

export interface SearchResponse {
  results: Visible[];
}

export type SearchResultType = 'user' | 'group' | 'bookmark';

export interface SearchResultBase {
  id: string;
  displayName: string;
  icon: ReactNode;
  type: SearchResultType;
}

export interface SharingItem {
  recipientId: string;
  recipientType: SearchResultType;
  permission: string[];
  displayName: string;
}
