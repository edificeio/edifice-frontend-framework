import { createContext, useContext } from 'react';

import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';

import {
  AvailableTab,
  MediaLibraryResult,
  MediaLibraryType,
} from './MediaLibrary';

export const MediaLibraryContext = createContext<{
  /** Application code (example: "blog") */
  appCode: string;

  /** Visibility of the uploaded files. */
  visibility?: WorkspaceVisibility;

  /** Allow selecting / uploading multiple files at once ? */
  multiple?: boolean;

  /** Type of resource to search for. */
  type: MediaLibraryType | null;

  /** Set the counter in the success button label. */
  setResultCounter: (count?: number) => void;

  /**
   * Set a innertab-specific callback which gets the result when success button is clicked.
   */
  setResult: (result?: MediaLibraryResult) => void;

  /** Memoize uploaded elements to be deleted on cancellation. */
  setCancellable: (uploads: WorkspaceElement[]) => void;

  /**
   * Allow an innertab to switch display to another innertab.
   * This function will throw an error if switching failed.
   */
  setVisibleTab: (tab: AvailableTab) => void;

  /** Allow an innertab to switch type of the media library. */
  switchType: (type: MediaLibraryType) => void;

  /**
   * Allow an innertab to set action to execute before triggering onSuccess.
   */
  setPreSuccess: (
    onSuccessAction?: () => () => Promise<MediaLibraryResult>,
  ) => void;
}>(null!);

export function useMediaLibraryContext() {
  const context = useContext(MediaLibraryContext);
  if (!context) {
    throw new Error(
      `Innertabs compound components cannot be rendered outside the MediaLibrary component`,
    );
  }
  return context;
}
