import { ReactNode, useMemo } from 'react';

import clsx from 'clsx';

import { useDropzone } from '../../hooks';
import { DropzoneContext } from './DropzoneContext';
import DropzoneDrag from './DropzoneDrag';
import DropzoneFile from './DropzoneFile';
import DropzoneImport from './DropzoneImport';

/**
 * Props for the Dropzone component.
 */
interface DropzoneProps {
  /**
   * Optional additional class names to apply to the dropzone.
   */
  className?: string;

  /**
   * Array of accepted file types.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers | MDN Documentation}.
   */
  accept?: string[];

  /**
   * Whether multiple files can be selected.
   */
  multiple?: boolean;

  /**
   * Whether the dropzone should handle the file drop.
   */
  handle?: boolean;

  /**
   * The content to be rendered inside the dropzone.
   */
  children?: ReactNode;
}

/**
 *
 * The Dropzone component allows to add or remove files. A `useDropzoneContext` hook is available to manage a specific UI component for handling file uploads.
 *
 */
const Dropzone = ({
  className,
  accept,
  multiple = true,
  handle = false,
  children,
}: DropzoneProps) => {
  const {
    inputRef,
    dragging,
    files,
    addFile,
    deleteFile,
    replaceFileAt,
    handleDragLeave,
    handleDragging,
    handleDrop,
    handleOnChange,
  } = useDropzone(accept ? { forceFilters: true } : undefined);

  const classes = clsx(
    'dropzone',
    {
      'is-dragging': !multiple ? files.length < 1 && dragging : dragging,
      'is-drop-files': files.length !== 0 && !handle ? false : true,
    },
    className,
  );

  const value = useMemo(
    () => ({
      inputRef,
      files,
      addFile,
      deleteFile,
      replaceFileAt,
    }),
    [addFile, deleteFile, replaceFileAt, files, inputRef],
  );

  return (
    <DropzoneContext.Provider value={value}>
      <div
        className={classes}
        onDragEnter={handleDragging}
        onDragOver={handleDragging}
        onDragLeave={handleDragLeave}
        onDrop={files.length > 0 && !multiple ? undefined : handleDrop}
      >
        <div className="d-flex flex-fill">
          {!handle ? (
            <>
              <Dropzone.File multiple={multiple}>{children}</Dropzone.File>
              <Dropzone.Import />
            </>
          ) : null}
          <Dropzone.Drag />
        </div>
        <input
          ref={inputRef}
          accept={accept?.join(',')}
          multiple={multiple}
          type="file"
          name="attachment-input"
          id="attachment-input"
          onChange={handleOnChange}
          hidden
        />
      </div>
    </DropzoneContext.Provider>
  );
};

Dropzone.File = DropzoneFile;
Dropzone.Import = DropzoneImport;
Dropzone.Drag = DropzoneDrag;

Dropzone.displayName = 'Dropzone';

export default Dropzone;
