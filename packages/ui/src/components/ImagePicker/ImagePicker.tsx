import {
  ComponentPropsWithRef,
  forwardRef,
  Ref,
  useEffect,
  useState,
} from 'react';

import { IWebApp } from '@edifice.io/ts-client';
import clsx from 'clsx';
import { Delete, Edit } from '../../../../icons/dist';

import { useDropzone } from '../../hooks';
import { AppIcon } from '../AppIcon';
import { Avatar } from '../Avatar';
import { IconButton } from '../Button';
import { FormControl } from '../Form';
import { Input } from '../Input';

export interface ImagePickerProps extends ComponentPropsWithRef<'input'> {
  /**
   * Description of the ImagePicker label.
   */
  label: string;
  /**
   * Accessible description of the add button
   */
  addButtonLabel: string;
  /**
   * Accessible description of the delete button
   */
  deleteButtonLabel: string;
  /**
   * Provide a default image as placeholder
   */
  src?: string;
  /**
   * To show the icon of an application
   */
  app?: IWebApp | undefined;

  appCode?: string;
  /**
   * Optional class for styling purpose
   */
  className?: string;
  /**
   * Callback when uploading image
   */
  onUploadImage: (file: File) => void;
  /**
   * Callback when deleting image
   */
  onDeleteImage: () => void;
}

export const ImagePicker = forwardRef(
  (
    {
      label,
      addButtonLabel = 'Add image',
      deleteButtonLabel = 'Delete image',
      src,
      className,
      app,
      onUploadImage,
      onDeleteImage,
    }: ImagePickerProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const [preview, setPreview] = useState<string>(src || '');

    const {
      inputRef,
      files,
      deleteFile,
      handleOnChange,
      handleDragging,
      handleDragLeave,
      handleDrop,
    } = useDropzone();

    useEffect(() => {
      if (files.length > 0) {
        deleteFile(files[0]);
        setPreview('');

        const file = files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        onUploadImage(file);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleClean = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      deleteFile(files[0]);
      setPreview('');
      onDeleteImage();
    };

    const classes = clsx('image-input', className);

    return (
      <FormControl
        id="image-input"
        className={classes}
        onDragEnter={handleDragging}
        onDragOver={handleDragging}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={ref}
      >
        <div className="image-input-actions gap-8">
          <IconButton
            aria-label={addButtonLabel}
            color="tertiary"
            icon={<Edit />}
            onClick={handleClick}
            type="button"
            variant="ghost"
          />
          <IconButton
            aria-label={deleteButtonLabel}
            color="danger"
            disabled={!preview}
            icon={<Delete width="20" height="20" />}
            onClick={handleClean}
            type="button"
            variant="ghost"
          />
        </div>
        <FormControl.Label>
          <span className="visually-hidden">{label}</span>
          <Input
            accept="image/jpeg, image/png"
            hidden
            onChange={handleOnChange}
            ref={inputRef}
            size="sm"
            type="file"
          />
          {preview ? (
            <Avatar alt="" src={preview} size="xl" />
          ) : (
            <AppIcon app={app} iconFit="ratio" size="160" variant="rounded" />
          )}
        </FormControl.Label>
      </FormControl>
    );
  },
);

ImagePicker.displayName = 'ImagePicker';
