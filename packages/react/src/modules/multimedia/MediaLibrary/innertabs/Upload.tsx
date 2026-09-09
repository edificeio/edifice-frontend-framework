import { WorkspaceElement } from '@edifice.io/client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropzone } from '../../../../components/Dropzone';
import { Flex } from '../../../../components/Flex';
import { Radio } from '../../../../components/Radio';
import { UploadSourceFileInfo } from '../../../../hooks';
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
 * @param sourceFilesInfo snapshot of the source files they came from, keyed by
 * uploaded element id (see `useUploadFiles`)
 * @param byAlpha `true` to sort by the source file name, `false` to sort by the
 * source file's last modification date (oldest first)
 */
const orderUploadedFiles = (
  uploadedFiles: WorkspaceElement[],
  sourceFilesInfo: Record<string, UploadSourceFileInfo>,
  byAlpha: boolean,
): WorkspaceElement[] => {
  // Sort against the original source file: the uploaded element may have been
  // renamed during upload, and its own dates all sit at upload time. Fall back
  // to the element's own name / epoch 0 when the source file can no longer be
  // found — should not happen in the normal upload flow.
  const infoOf = (element: WorkspaceElement) =>
    element._id ? sourceFilesInfo[element._id] : undefined;
  const nameOf = (element: WorkspaceElement) =>
    infoOf(element)?.name ?? element.name;
  const lastModifiedOf = (element: WorkspaceElement) =>
    infoOf(element)?.lastModified ?? 0;

  if (byAlpha) {
    return [...uploadedFiles].sort((a, b) =>
      nameOf(a).localeCompare(nameOf(b), undefined, { numeric: true }),
    );
  }

  // Sort "most recent first" (the order that has proven reliable), then flip it
  // to hand the editor an "oldest first" list.
  return [...uploadedFiles]
    .sort((a, b) => lastModifiedOf(b) - lastModifiedOf(a))
    .reverse();
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
  const sourceFilesInfoRef = useRef<Record<string, UploadSourceFileInfo>>({});

  const handleOnFilesChange = (
    uploadedFiles: WorkspaceElement[],
    sourceFilesInfo: Record<string, UploadSourceFileInfo>,
  ) => {
    sourceFilesInfoRef.current = sourceFilesInfo;
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
            sourceFilesInfoRef.current,
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
