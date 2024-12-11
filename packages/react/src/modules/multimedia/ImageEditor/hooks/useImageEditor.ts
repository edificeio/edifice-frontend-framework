import { useEffect, useState } from 'react';

import * as PIXI from 'pixi.js';

import '@pixi/mixin-get-child-by-name';
import useHistoryTool from './useHistoryTool';
import useImageEffects from './useImageEffects';
import {
  DEFAULT_SPRITE_NAME,
  updateImage,
  saveAsBlob,
  saveAsDataURL,
  updateImageFromBlob,
} from '../effects/misc';

/**
 * This hook expose all the functions available for the pixi editor:
 * - all the effects (crop, resize, rotate, blur)
 * - historize every action
 * - backup functions
 *
 * @param args.spriteName The spriteName of the original image
 * @param args.imageSrc The URL of the image to edit
 * @returns all the action available for the image editor
 */
export default function useImageEditor({
  imageSrc,
  spriteName = DEFAULT_SPRITE_NAME,
}: {
  imageSrc: string;
  spriteName?: string;
}) {
  const [application, setApplication] = useState<PIXI.Application | undefined>(
    undefined,
  );

  const [loading, setLoading] = useState(true);

  const {
    rotate,
    startBlur,
    startCrop,
    startResize,
    stopBlur,
    stopCrop,
    stopResize,
  } = useImageEffects({
    spriteName,
    application,
    onSave(sprite) {
      if (application) {
        updateImage(application, {
          imgDatasource: sprite,
          spriteName,
        });
      }
    },
  });

  const toBlob = (): Promise<Blob | undefined> => {
    if (!application) return Promise.resolve(undefined);
    return saveAsBlob(application);
  };
  const toDataURL = (): string | undefined => {
    if (!application) return undefined;
    return saveAsDataURL(application);
  };

  const { restore, historize, historyCount } = useHistoryTool({
    application,
    spriteName,
    onRestore(imgDatasource, state) {
      if (!application) return undefined;
      updateImageFromBlob(application, {
        imgDatasource,
        spriteName,
        settings: state,
      });
    },
  });

  useEffect(() => {
    if (!application) return undefined;
    setLoading(true);
    updateImage(application, { spriteName, imgDatasource: imageSrc }).finally(
      () => setLoading(false),
    );
  }, [application, imageSrc, spriteName]);

  return {
    historyCount,
    setApplication,
    restore,
    stopCrop,
    stopBlur,
    stopResize,
    startResize: async () => {
      setLoading(true);
      await historize(startResize);
      setLoading(false);
    },
    startCrop: async () => {
      setLoading(true);
      await historize(startCrop);
      setLoading(false);
    },
    startBlur: async () => {
      setLoading(true);
      await historize(startBlur);
      setLoading(false);
    },
    rotate: async () => {
      setLoading(true);
      await historize(rotate);
      setLoading(false);
    },
    toBlob,
    toDataURL,
    loading,
  };
}
