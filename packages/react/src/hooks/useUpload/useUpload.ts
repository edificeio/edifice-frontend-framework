import { useCallback, useState } from 'react';

import {
  ERROR_CODE,
  VideoUploadParams,
  WorkspaceElement,
  WorkspaceVisibility,
  odeServices,
} from '@edifice.io/client';

import { getOrGenerateBlobId } from '@edifice.io/utilities';
import { useBrowserInfo } from '../../hooks';
import { Status } from '../../types';
import { useWorkspaceFile } from '../useWorkspaceFile';
import { useTranslation } from 'react-i18next';

const useUpload = (
  visibility?: WorkspaceVisibility,
  application: string = 'media-library',
) => {
  const [status, setStatus] = useState<Record<string, Status>>({});

  const { browser, device } = useBrowserInfo(navigator.userAgent);
  const { create } = useWorkspaceFile();
  const { t } = useTranslation();

  /** Get the status of a file or blob being uploaded. */
  const getUploadStatus: (upload: File | Blob) => Status | undefined =
    useCallback(
      (upload: File | Blob) => status[getOrGenerateBlobId(upload)],
      [status],
    );

  /** Set the status of an uploaded file or blob. */
  const setUploadStatus = (blob: File | Blob, status: Status) => {
    setStatus((prevStatus) => {
      const key = getOrGenerateBlobId(blob);
      return {
        ...prevStatus,
        [key]: status,
      };
    });
  };

  /** Reset the status of an uploaded file or blob. */
  const clearUploadStatus = (blob: File | Blob) => {
    setStatus((prevStatus) => {
      const key = getOrGenerateBlobId(blob);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: unused, ...rest } = prevStatus;
      return rest;
    });
  };

  const getDefaultDate = () => {
    const d = new Date();
    return (
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(d.getDate()).padStart(2, '0')} ${String(
        d.getHours(),
      ).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')} ` +
      ' ' +
      t('bbm.video.recorder.defaultName')
    );
  };

  /** Upload a file. */
  async function uploadFile(file: File, metadata?: { duration: number }) {
    setUploadStatus(file, 'loading');
    try {
      let resource;
      if (application === 'media-library' && file.type.includes('video')) {
        // In media-library, video files are reencoded to streamable mp4.
        resource = await uploadVideo(file, {
          filename: file.name,
          ...metadata,
        });
      } else {
        resource = await create(file, { application, visibility });
      }
      setUploadStatus(file, 'success');
      return resource;
    } catch (error) {
      console.error(error);
      setUploadStatus(file, 'error');
      return null;
    }
  }

  /** Upload a blob. */
  async function uploadBlob(
    blob: Blob,
    metadata?: { filename?: string; duration?: number },
  ) {
    setUploadStatus(blob, 'loading');
    try {
      let resource;
      if (blob.type.includes('video')) {
        // Video blobs are reencoded to streamable mp4.
        resource = await uploadVideo(blob, metadata);
      } else {
        // Other blobs not supported at the moment
        throw new Error(ERROR_CODE.NOT_SUPPORTED);
      }
      setUploadStatus(blob, 'success');
      return resource;
    } catch (error) {
      console.error(error);
      setUploadStatus(blob, 'error');
      return null;
    }
  }

  const uploadVideo = async (
    blob: Blob,
    metadata?: { filename?: string; duration?: number },
  ) => {
    const params: VideoUploadParams = {
      data: {
        device: device.type,
        browser: { name: browser.name, version: browser.version },
        url: window.location.hostname,
        file: blob,
        filename: getDefaultDate() ?? 'filename',
        weight: blob.size,
      },
      appCode: application,
      captation: !(blob instanceof File),
      duration: metadata?.duration ?? 0,
    };

    const uploadResponse = await odeServices.video().upload(params);
    if (uploadResponse.state === 'succeed') {
      const resVideo: WorkspaceElement = {
        _id: uploadResponse.videoworkspaceid,
        file: uploadResponse.videoid,
        name: params.data.filename,
        eType: 'file',
        eParent: '',
        children: [],
        created: new Date(),
        _shared: [],
        _isShared: false,
        owner: { userId: '', displayName: '' },
      };
      return resVideo;
    } else if (uploadResponse.state === 'error') {
      throw new Error(uploadResponse.code || 'Error while uploading video');
    } else {
      throw new Error('Video encoding is still running');
    }
  };

  function uploadAlternateFile(
    original: File,
    replacement: File,
    metadata?: { duration: number },
  ) {
    // The original and its alternate must share the same virtual id.
    getOrGenerateBlobId(replacement, getOrGenerateBlobId(original));
    return uploadFile(replacement, metadata);
  }

  return {
    getUploadStatus,
    setUploadStatus,
    clearUploadStatus,
    uploadFile,
    uploadAlternateFile,
    uploadBlob,
  };
};

export default useUpload;
