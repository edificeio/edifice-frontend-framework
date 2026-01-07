import { WorkspaceElement } from '@edifice.io/client';

import { Dropzone } from '../../../../components/Dropzone';
import { UploadFiles } from '../../UploadFiles';
import { MediaLibraryType } from '../MediaLibrary';
import { useMediaLibraryContext } from '../MediaLibraryContext';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../../../components/Alert';

/**
 * Get acceptable file (MIME-)types or extensions, for a MediaLibraryType.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers
 *
 * @param type type of MediaLibrary
 * @returns array of acceptable types
 */
const acceptedTypes = (type: MediaLibraryType) => {
  const acceptedTypes = [];

  switch (type) {
    case 'audio':
      acceptedTypes.push('audio/*');
      break;
    case 'video':
      acceptedTypes.push('video/*');
      break;
    case 'image':
      acceptedTypes.push('image/png');
      acceptedTypes.push('image/jpeg');
      acceptedTypes.push('image/webp');
      acceptedTypes.push('image/gif');
      acceptedTypes.push('image/avif');
      acceptedTypes.push('image/heic');
      break;
    default:
      break;
  }
  return acceptedTypes;
};

export const Upload = () => {
  const { t } = useTranslation();

  const {
    type,
    visibility,
    multiple,
    setResult,
    setResultCounter,
    setCancellable,
  } = useMediaLibraryContext();

  const handleOnFilesChange = (uploadedFiles: WorkspaceElement[]) => {
    if (uploadedFiles.length) {
      // Uploaded files are subject to cancel action
      setCancellable(uploadedFiles);
      // Uploaded files are subject to success action
      setResultCounter(uploadedFiles.length);
      setResult(uploadedFiles);
    } else {
      setCancellable([]);
      setResultCounter(undefined);
      setResult(undefined);
    }
  };

  return (
    <div className="flex-grow-1">
      {multiple && (
        <Alert type="info" className="flex-shrink-0 mb-16">
          {t('bbm.upload.alert')}
        </Alert>
      )}
      <Dropzone multiple={multiple} accept={acceptedTypes(type ?? 'embedder')}>
        <UploadFiles
          onFilesChange={handleOnFilesChange}
          visibility={visibility}
        />
      </Dropzone>
    </div>
  );
};
