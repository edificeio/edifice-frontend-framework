import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';

import { customSize } from '@edifice.io/utilities';
import { useEffect, useRef } from 'react';
import { useUploadFiles } from '../../../hooks';
import { ImageEditor } from '../ImageEditor';
import { UploadCard } from '../UploadCard';

const UploadFiles = ({
  onFilesChange,
  visibility = 'protected',
}: {
  onFilesChange: (uploadedFiles: WorkspaceElement[]) => void;
  visibility?: WorkspaceVisibility;
}) => {
  const {
    files,
    uploadedFiles,
    getUploadStatus,
    uploadFile,
    removeFile,
    updateImage,
    editingImage,
    setEditingImage,
    getUrl,
  } = useUploadFiles({
    handleOnChange: onFilesChange,
    application: 'media-library',
    visibility,
  });

  /**
   * By using useRef to store blobs
   * We know that ref doesn't re-render
   * We avoid unexpected images/blob download when uploading files
   */
  const fileBlobs = useRef(new Map());

  useEffect(() => {
    const blobs = fileBlobs.current;

    /**
     * We use the clean up function inside the useEffect to revoke blobs
     */
    return () => {
      blobs.forEach((url) => URL.revokeObjectURL(url));
      blobs.clear();
    };
  }, []);

  /**
   * We create the current element with a function
   * @param file
   */
  const renderItem = (file: File) => {
    const isTypeImage = file.type.startsWith('image');
    const src = isTypeImage ? fileBlobs.current.get(file.name) : '';
    /**
     * We check if a blob already exists for a file
     * If not, we add a new blob
     */
    if (!fileBlobs.current.has(file.name)) {
      fileBlobs.current.set(file.name, URL.createObjectURL(file));
    }

    return {
      name: file.name,
      info: {
        type: file.type,
        weight: customSize(file.size || 0, 1),
      },
      src,
    };
  };

  /**
   * We delete file's blob
   * We remove the file from the uploaded list
   * @param file
   */
  const handleRemoveFile = (file: File) => {
    const blobUrl = fileBlobs.current.get(file.name);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      fileBlobs.current.delete(file.name);
    }
    removeFile(file);
  };

  return (
    <>
      {files.map((file) => {
        const resource = uploadedFiles.find(
          (uploadedFile) => uploadedFile.name === file.name,
        );

        return (
          <UploadCard
            key={file.name}
            status={getUploadStatus(file)}
            item={renderItem(file)}
            onEdit={() => setEditingImage(resource)}
            onRetry={() => uploadFile(file)}
            onDelete={() => handleRemoveFile(file)}
          />
        );
      })}
      {editingImage && (
        <ImageEditor
          altText={editingImage.alt}
          legend={editingImage.title}
          image={getUrl(editingImage, true)}
          isOpen={!!editingImage}
          onCancel={() => setEditingImage(undefined)}
          onSave={updateImage}
          onError={console.error}
        />
      )}
    </>
  );
};

UploadFiles.displayName = 'UploadFiles';

export default UploadFiles;
