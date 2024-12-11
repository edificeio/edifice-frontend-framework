import { useRef, useState } from 'react';

import { WorkspaceElement } from '@edifice.io/client';
import { TabsItemProps } from '../../components';
import { MediaLibraryRef, MediaLibraryResult } from '../../modules/multimedia';
import { useWorkspaceFile } from '../useWorkspaceFile';

const useMediaLibrary = () => {
  const mediaLibraryRef = useRef<MediaLibraryRef>(null);
  const [libraryMedia, setLibraryMedia] = useState<MediaLibraryResult>();
  const { remove } = useWorkspaceFile();

  const onCancel = async (uploads?: WorkspaceElement[]) => {
    if (mediaLibraryRef.current?.type && uploads && uploads.length > 0) {
      await remove(uploads);
    }
    mediaLibraryRef.current?.hide();
  };

  const onSuccess = (result: MediaLibraryResult) => {
    let updatedMedia;

    switch (mediaLibraryRef.current?.type) {
      case 'video': {
        if (typeof result === 'object') {
          updatedMedia = result[0];
        } else {
          const parser = new DOMParser();
          const doc = parser.parseFromString(result, 'text/html');
          const element = doc.body.firstChild as HTMLBodyElement;

          const href = element?.getAttribute('src');
          mediaLibraryRef.current?.hide();
          updatedMedia = href;
        }
        break;
      }
      case 'embedder': {
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, 'text/html');
        const element = doc.body.firstChild as HTMLBodyElement;

        const href = element?.getAttribute('src');
        mediaLibraryRef.current?.hide();
        updatedMedia = href;
        break;
      }
      case 'audio': {
        if (result.length === undefined) {
          updatedMedia = result;
        } else {
          updatedMedia = result[0];
        }
        break;
      }
      case 'hyperlink': {
        updatedMedia = result;
        break;
      }
      case 'image': {
        const imagePath = `/workspace/document/${result[0]._id}`;
        updatedMedia = imagePath;
        break;
      }
      default: {
        updatedMedia = result[0];
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
