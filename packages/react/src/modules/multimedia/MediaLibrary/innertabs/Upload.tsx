import { WorkspaceElement } from '@edifice.io/client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropzone } from '../../../../components/Dropzone';
import { Flex } from '../../../../components/Flex';
import { Radio } from '../../../../components/Radio';
import { UploadFiles } from '../../UploadFiles';
import { MediaLibraryType } from '../MediaLibrary';
import { useMediaLibraryContext } from '../MediaLibraryContext';

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

/**
 * Re-order uploaded elements just before they are handed over to the editor.
 * @param uploadedFiles workspace elements resulting from the upload
 * @param sourceFiles the device files they were uploaded from
 * @param byAlpha `true` to sort by file name, `false` to sort by the source
 * file's last modification date (most recent first)
 */
const orderUploadedFiles = (
  uploadedFiles: WorkspaceElement[],
  sourceFiles: File[],
  byAlpha: boolean,
): WorkspaceElement[] => {
  if (byAlpha) {
    return [...uploadedFiles].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true }),
    );
  }

  // Source files are matched by name (names are unique in the upload flow).
  // Elements whose source can no longer be found keep their relative order.
  const lastModifiedByName = new Map(
    sourceFiles.map((file) => [file.name, file.lastModified]),
  );
  return [...uploadedFiles].sort(
    (a, b) =>
      (lastModifiedByName.get(b.name) ?? 0) -
      (lastModifiedByName.get(a.name) ?? 0),
  );
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
    setPreSuccess,
  } = useMediaLibraryContext();

  // When several files are uploaded at once, let the user pick the order in
  // which they are added: alphabetically (default) or by last modification date.
  const [sortByAlpha, setSortByAlpha] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<WorkspaceElement[]>([]);
  // Kept in a ref: only read when the pre-success action runs, not on render.
  const sourceFilesRef = useRef<File[]>([]);

  const handleOnFilesChange = (
    uploadedFiles: WorkspaceElement[],
    sourceFiles: File[],
  ) => {
    sourceFilesRef.current = sourceFiles;
    setUploadedFiles(uploadedFiles);

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

  // The chosen ordering is only applied when the user clicks "Add": register a
  // pre-success action that re-orders the uploaded files right before they are
  // transmitted to the editor. Only relevant when several files can be uploaded.
  useEffect(() => {
    if (!multiple || !uploadedFiles.length) {
      setPreSuccess(undefined);
      return;
    }
    setPreSuccess(
      () => () =>
        Promise.resolve(
          orderUploadedFiles(
            uploadedFiles,
            sourceFilesRef.current,
            sortByAlpha,
          ),
        ),
    );
  }, [multiple, uploadedFiles, sortByAlpha, setPreSuccess]);

  return (
    <div className="flex-grow-1">
      {multiple && (
        <Flex className="mb-16 ms-8" align="start" direction="column" gap="8">
          <div>{t('bbm.upload.sort.title')} :</div>
          <Radio
            label={t('bbm.upload.sort.alpha')}
            name="media-library-upload-sort"
            value="alpha"
            model={sortByAlpha ? 'alpha' : 'date'}
            checked={sortByAlpha}
            onChange={() => setSortByAlpha(true)}
            data-testid="media-library-upload-sort-alpha"
          />
          <Radio
            label={t('bbm.upload.sort.date')}
            name="media-library-upload-sort"
            value="date"
            model={sortByAlpha ? 'alpha' : 'date'}
            checked={!sortByAlpha}
            onChange={() => setSortByAlpha(false)}
            data-testid="media-library-upload-sort-date"
          />
        </Flex>
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
