import { ReactNode, useMemo } from 'react';

import clsx from 'clsx';

import { DropzoneContext } from './DropzoneContext';
import DropzoneDrag from './DropzoneDrag';
import DropzoneFile from './DropzoneFile';
import DropzoneImport from './DropzoneImport';
import { useDropzone } from '../../hooks';

interface DropzoneProps {
  className?: string;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers */
  accept?: string[];
  multiple?: boolean;
  handle?: boolean;
  children?: ReactNode;
}

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
        <div className="align-center">
          {!handle ? (
            <>
              <Dropzone.File>{children}</Dropzone.File>
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
