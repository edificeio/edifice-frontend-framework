import { ComponentPropsWithoutRef, useEffect, useState } from "react";

import { Delete, Edit } from "@edifice-ui/icons";
import { IWebApp } from "edifice-ts-client";

import clsx from "clsx";
import { AppIcon } from "../../components/AppIcon";
import { Avatar } from "../../components/Avatar";
import { IconButton } from "../../components/Button";

export interface ImagePickerWorkspaceProps
  extends ComponentPropsWithoutRef<"div"> {
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
   * Pathe element select in WorkSpace
   */
  libraryMedia: string;
  /**
   * Element select in WorkSpace
   */
  mediaLibraryRef: any;
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
  onUploadImage: (file: File | string) => void;
  /**
   * Callback when deleting image
   */
  onDeleteImage: () => void;

  /**
   * Size of the image picker workspace
   */
  size?: "160" | (string & {});
}

const ImagePickerWorkspace = ({
  addButtonLabel = "Add image",
  deleteButtonLabel = "Delete image",
  src,
  size = "160",
  className,
  mediaLibraryRef,
  libraryMedia,
  app,
  onUploadImage,
  onDeleteImage,
}: ImagePickerWorkspaceProps) => {
  const [preview, setPreview] = useState<string>(src || "");

  useEffect(() => {
    if (libraryMedia) {
      setPreview(libraryMedia);
      onUploadImage(libraryMedia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryMedia]);

  const handleClick = () => {
    mediaLibraryRef.current?.show("image");
  };

  const handleClean = () => {
    setPreview("");
    onDeleteImage();
  };

  const classes = clsx("image-input", className);

  return (
    <div
      id="image-input"
      className={classes}
      style={{ width: size + "px", height: size + "px" }}
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
      {preview ? (
        <Avatar alt="" src={preview} size="xl" />
      ) : (
        <AppIcon app={app} iconFit="ratio" size={size} variant="rounded" />
      )}
    </div>
  );
};

ImagePickerWorkspace.displayName = "ImagePickerWorkspace";

export default ImagePickerWorkspace;
