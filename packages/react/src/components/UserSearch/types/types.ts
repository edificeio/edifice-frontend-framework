import type { ReactNode } from 'react';
import { SearchResultType, SharingItem } from '../../../types';
import { Visible } from './visible';

export type { SearchResultType, SharingItem };

export interface UserSearchProps {
  placeholder?: string;
  isAdmlcOrAdmc?: boolean;
  bookmarks?: Visible[];
  initialSharings?: SharingItem[];
  getSearchResults: (searchInputValue: string) => Promise<SearchResponse>;
  onSearchResultsChange?: (searchResult: Visible) => void;
}

export interface UserSearchRef {
  removeSharing: (recipientId: string) => void;
}

export interface SearchResponse {
  results: Visible[];
}

export interface SearchResultBase {
  id: string;
  displayName: string;
  icon: ReactNode;
  type: SearchResultType;
}
