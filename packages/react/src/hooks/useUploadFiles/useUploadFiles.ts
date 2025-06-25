import { useCallback, useEffect, useState } from 'react';

import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';
import { ImageResizer, addTimestampToImageUrl } from '@edifice.io/utilities';

import { useDropzoneContext } from '../../components';
import { useUpload } from '../useUpload';
import { useWorkspaceFile } from '../useWorkspaceFile';

const useUploadFiles = ({
  handleOnChange,
  visibility,
  application,
}: {
  handleOnChange: (uploadedFiles: WorkspaceElement[]) => void;
  visibility?: WorkspaceVisibility;
  application?: string;
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<WorkspaceElement[]>([]);
  const [editingImage, setEditingImage] = useState<
    WorkspaceElement | undefined
  >(undefined);

  const { files, deleteFile, replaceFileAt, inputRef } = useDropzoneContext();
  const { remove, createOrUpdate } = useWorkspaceFile();
  const {
    getUploadStatus,
    setUploadStatus,
    clearUploadStatus,
    uploadFile,
    uploadAlternateFile,
  } = useUpload(visibility, application);

  const resetInputValue = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const tryUploading = useCallback(
    (files: Array<File | null>) => {
      files.forEach(async (file, index) => {
        if (file == null) return;
        let resource, replacement;

        if (file.type.startsWith('image')) {
          try {
            replacement = await ImageResizer.resizeImageFile(file);
            resource = await uploadAlternateFile(file, replacement);
            replaceFileAt(index, replacement);
          } catch (err) {
            console.error(err);
          }
        }

        if (!resource && !replacement) {
          resource = await uploadFile(file);
        }

        if (resource) {
          setUploadedFiles((prevFiles: WorkspaceElement[]) => [
            ...prevFiles,
            resource,
          ]);
        } else {
          resetInputValue();
        }
      });
    },
    [uploadAlternateFile, uploadFile, replaceFileAt],
  );

  /* Try to upload more files when 
    - the `files` list has been updated, 
    - or a file has been uploaded, leaving a slot free.
  */
  useEffect(() => {
    /* but not upload :
      - the same file twice (by checking if an upload Status already exists for it).
        To upload it again, reset its previous status first.
      - more than 5 files at once.
    */
    const UPLOAD_SLOTS = 5;
    let numUploads = 0;
    // Check which new files can be uploaded right now.
    const newFiles = files.map((file) => {
      if (numUploads >= UPLOAD_SLOTS) return null;
      const status = getUploadStatus(file);
      // If this file is currently loading => it uses a slot.
      if (status === 'loading') numUploads++;
      // If this file has already been sent in a slot => don't send it again.
      if (status) return null;
      return file;
    });

    newFiles.forEach((file) => file && setUploadStatus(file, 'idle'));
    tryUploading(newFiles);
  }, [files, uploadedFiles, getUploadStatus, setUploadStatus, tryUploading]);

  /** When file finished being uploaded, sort and handle the result. */
  useEffect(() => {
    const sortedUploadedFiles = sortUploadedFiles(files, uploadedFiles);
    handleOnChange(sortedUploadedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles]);

  const sortUploadedFiles = (
    filesArray: File[],
    uploadedFilesArray: WorkspaceElement[],
  ) => {
    const orderMap = filesArray.reduce(
      (acc: any, item: File, index: number) => {
        acc[item.name] = index;
        return acc;
      },
      {},
    );
    return uploadedFilesArray.sort(
      (a: WorkspaceElement, b: WorkspaceElement) =>
        orderMap[a.name] - orderMap[b.name],
    );
  };

  async function removeFile(file: File) {
    // Check if this file was successfully uploaded.
    const resource = uploadedFiles.find(
      (uploadedFile) => uploadedFile.name === file.name,
    );

    // Remove the corresponding resource from `uploadedFiles`
    if (resource) {
      await remove(resource);
      clearUploadStatus(file);
      setUploadedFiles((prevFiles: WorkspaceElement[]) => {
        return prevFiles.filter((prevFile) => prevFile.name !== resource?.name);
      });
    }
    // Remove the file from `files`
    deleteFile(file);
    resetInputValue();
  }

  async function updateImage({
    blob,
    legend,
    altText: alt,
  }: {
    blob: Blob;
    legend: string;
    altText: string;
  }) {
    if (!editingImage) {
      return;
    }
    try {
      const res = await createOrUpdate({
        blob,
        legend,
        alt,
        uri: getUrl(editingImage),
      });

      /**
       * `res` contains updated file and src path
       * update uploadedFiles with the correct updated information
       */
      if (res && typeof res === 'object') {
        setUploadedFiles((prevFiles: WorkspaceElement[]) => {
          return prevFiles.map((prevFile) => {
            if (prevFile._id === res.file._id) {
              return { ...res.file, title: legend, alt };
            }
            return prevFile;
          });
        });
      }
    } finally {
      setEditingImage(undefined);
    }
  }

  const getUrl = (resource?: WorkspaceElement, timestamp?: boolean) => {
    const url = `/workspace/${
      resource?.public ? 'pub/' : ''
    }document/${resource?._id}`;

    if (!resource) return '';
    /**
     * WB-3053: add timestamp if option is true
     */
    if (timestamp) return addTimestampToImageUrl(url);

    return url;
  };

  return {
    /** List of files added from device */
    files,
    getUploadStatus,
    clearUploadStatus,
    uploadedFiles,
    editingImage,
    setEditingImage,
    getUrl,
    updateImage,
    uploadFile,
    removeFile,
  };
};

export default useUploadFiles;
