import { ChangeEvent, useRef, useState } from 'react';
import { HEIC_MIME_TYPES } from '../../utilities/mime-types/mime-types-utils';

const useDropzone = (props?: {
  /**
   * Truthy when the `accept` attribute of the referenced `input[type=file]`
   * must be force-checked against any added file.
   */
  forceFilters: boolean;
}) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFile = (file: File) => {
    addFiles([file]);
  };

  const deleteFile = (file: File) => {
    setFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.name !== file.name),
    );
  };

  const replaceFileAt = (index: number, file: File) => {
    setFiles((prevFiles) => {
      if (0 <= index && index < prevFiles.length) {
        const firstPart = prevFiles.slice(0, index);
        const lastPart =
          index === prevFiles.length - 1 ? [] : prevFiles.slice(index + 1);
        return [...firstPart, file, ...lastPart];
      }
      return prevFiles;
    });
  };

  const applyInputFiltersOn = (files: File[]) => {
    let filteredFiles: File[] = files;
    if (inputRef.current?.accept) {
      // Reject files which do not pass the `accept` filter.
      const filters = inputRef.current.accept
        .split(',')
        .map((filter) => filter.trim().toLowerCase());
      const extensions = filters.filter((filter) => filter.startsWith('.'));
      const mimes = filters
        .filter((filter) => !filter.startsWith('.'))
        .map((mime) => mime.replace('*', ''));

      filteredFiles = [];
      files.forEach((file) => {
        const fileName = file.name.toLowerCase();
        if (
          extensions.some((extension) => fileName.endsWith(extension)) ||
          mimes.some((mime) => file.type.includes(mime))
        ) {
          filteredFiles.push(file);
        }
      });
    }
    return filteredFiles;
  };

  const addFiles = async (files: File[]) => {
    // #PEDAGO-3263: Convert HEIC/HEIF images to JPEG.
    const convertedFiles = await convertHEICImages(files);

    const sortedFiles = convertedFiles.sort(
      (a, b) => b.lastModified - a.lastModified,
    );
    let filesToAdd = sortedFiles.map(
      (file) =>
        // #WB-3377: Remove special characters from the file name. (it can cause issues with vertx which replace it or remove it)
        new File([file], file.name.replace(/[!:,;="']/g, ''), {
          type: file.type,
        }),
    );
    filesToAdd.reverse();
    if (props?.forceFilters) {
      filesToAdd = applyInputFiltersOn(filesToAdd);
      if (filesToAdd && filesToAdd.length)
        setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    } else {
      setFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  /**
   * Convert HEIC/HEIF images to JPEG format if found.
   * @param files selected files
   * @returns a Promise resolving to an array of Files with HEIC/HEIF images converted to JPEGs.
   */
  const convertHEICImages = async (files: File[]): Promise<File[]> => {
    if (files === null || files.length === 0) {
      return [];
    }

    // Dynamic import of the heic2any library to avoid lib initial calls of
    // HTMLCanvasElement.getContext and Worker (not available in JSDom)
    // Import only if there is at least one HEIC/HEIF image
    let heic2any: any;
    const hasHEICImages = files.some((file) =>
      HEIC_MIME_TYPES.includes(file.type),
    );
    if (hasHEICImages) {
      heic2any = (await import('heic2any')).default;
    }

    return Promise.all(
      files.map(async (file) => {
        //  Convert only HEIC/HEIF images
        if (HEIC_MIME_TYPES.includes(file.type) && heic2any) {
          try {
            const converted = await heic2any({
              blob: file,
              toType: 'image/jpeg',
            });
            const newFile = new File(
              [converted as Blob],
              file.name.replace(/\.(heic|heif)$/i, '.jpeg'),
              { type: 'image/jpeg' },
            );
            return newFile;
          } catch (error) {
            console.error(`Failed to convert HEIC image: ${file.name}`, error);
            return file; // Return original file if conversion fails
          }
        }
        return file;
      }),
    );
  };

  const cleanFiles = () => {
    setFiles([]);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) addFiles([...files]);
  };

  const handleDragging = <T extends HTMLElement>(event: React.DragEvent<T>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = <T extends HTMLElement>(
    event: React.DragEvent<T>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDrop = async <T extends HTMLElement>(
    event: React.DragEvent<T>,
  ) => {
    handleDragLeave(event);
    const files = event.dataTransfer?.files;
    if (files) {
      await addFiles([...files]);
      if (inputRef?.current) {
        inputRef.current.files = files;
      }
    }
  };

  return {
    /** Reference to an `input[type=file]` HTMLElement, null at first. */
    inputRef,
    /** Read-only list of File·s  managed by this hook. */
    files,
    /** Truthy when a drag event is triggered. */
    dragging,
    /** Callback to attach to your drop zone (any HTMLElement). */
    handleDragging,
    /** Callback to attach to your drop zone (any HTMLElement). */
    handleDragLeave,
    /** Callback to attach to your drop zone (any HTMLElement). */
    handleDrop,
    /** Replace a file in the `files` list. */
    replaceFileAt,
    /** Remove a file from the `files` list. */
    deleteFile,
    /** Add a file to the `files` list. */
    addFile,
    /** Add many files to the `files` list. */
    addFiles,
    /** Empty the `files` list. */
    cleanFiles,
    /** Callback to attach to your `input[type=file]` HTMLElement. */
    handleOnChange,
  };
};

export default useDropzone;
