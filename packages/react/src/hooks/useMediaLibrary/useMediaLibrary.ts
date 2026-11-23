import { useRef, useState } from 'react';

import { WorkspaceElement } from '@edifice.io/client';
import { TabsItemProps } from '../../components';
import { MediaLibraryRef, MediaLibraryResult } from '../../modules/multimedia';
import { useWorkspaceFile } from '../useWorkspaceFile';

/** Path of a workspace document. */
const toDocumentPath = (element?: WorkspaceElement) =>
  element ? `/workspace/document/${element._id}` : undefined;

/** Extract the `src` attribute of an HTML fragment (embed code). */
const extractSrc = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const element = doc.body.firstChild as HTMLElement | null;
  return element?.getAttribute?.('src') ?? undefined;
};

/** Extract the path or URL of a link result (internal or external). */
const toLinkPath = (result: MediaLibraryResult) => {
  if (typeof result === 'string') return result;
  if ('url' in result) return result.url;
  if ('resources' in result) return result.resources?.[0]?.path;
  return undefined;
};

/** First workspace element of a result, whether single or multiple. */
const firstElement = (result: MediaLibraryResult) =>
  (Array.isArray(result) ? result[0] : result) as WorkspaceElement | undefined;

const useMediaLibrary = () => {
  const mediaLibraryRef = useRef<MediaLibraryRef>(null);
  /** Path or URL of the selected media. */
  const [libraryMedia, setLibraryMedia] = useState<string>();
  const { remove } = useWorkspaceFile();

  const onCancel = async (uploads?: WorkspaceElement[]) => {
    if (mediaLibraryRef.current?.type && uploads && uploads.length > 0) {
      await remove(uploads);
    }
    mediaLibraryRef.current?.hide();
  };

  const onSuccess = (result: MediaLibraryResult) => {
    let updatedMedia: string | undefined;

    switch (mediaLibraryRef.current?.type) {
      case 'video':
      case 'embedder': {
        updatedMedia =
          typeof result === 'string'
            ? extractSrc(result)
            : toDocumentPath(firstElement(result));
        break;
      }
      case 'hyperlink': {
        updatedMedia = toLinkPath(result);
        break;
      }
      default: {
        updatedMedia =
          typeof result === 'string'
            ? result
            : toDocumentPath(firstElement(result));
      }
    }

    mediaLibraryRef.current?.hide();
    setLibraryMedia(updatedMedia);
  };

  const onTabChange = async (
    _tab: TabsItemProps,
    uploads?: WorkspaceElement[],
  ) => {
    if (mediaLibraryRef.current?.type && uploads && uploads.length > 0) {
      await remove(uploads);
    }
  };

  return {
    ref: mediaLibraryRef,
    libraryMedia,
    setLibraryMedia,
    onCancel,
    onSuccess,
    onTabChange,
  };
};

export default useMediaLibrary;
