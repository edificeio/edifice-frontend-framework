import * as PIXI from 'pixi.js';

import * as blurEffect from '../effects/blur';
import * as cropEffect from '../effects/crop';
import * as resizeEffect from '../effects/resize';
import * as rotateEffect from '../effects/rotate';

export interface UseImageEffectsProps {
  spriteName: string;
  application?: PIXI.Application;
  onSave(sprite: PIXI.Sprite): void;
}
/**
 * This hook expose all effects of the pixi editor
 *
 * @param args.spriteName The spriteName of the original image
 * @param args.application The PIXI.Application context
 * @param args.onSave A callback called when the sprite changes
 * @returns all the action available for the image editor
 */
export default function useImageEffects({
  application,
  spriteName,
  onSave,
}: UseImageEffectsProps) {
  const startCrop = () => {
    if (!application) return;
    cropEffect.start(application, { spriteName });
  };
  const stopCrop = (save: boolean) => {
    if (!application) return;
    if (save) {
      const result = cropEffect.save(application);
      result && onSave(result);
    }
    cropEffect.stop(application);
  };
  const startBlur = () => {
    if (!application) return;
    blurEffect.start(application, { spriteName });
  };
  const stopBlur = () => {
    if (!application) return;
    blurEffect.stop(application);
  };
  const stopResize = (save: boolean) => {
    if (!application) return;
    if (save) {
      const result = resizeEffect.save(application);
      if (result) {
        onSave(result);
      }
    }
    resizeEffect.stop(application);
  };
  const startResize = () => {
    if (!application) return;
    resizeEffect.start(application, spriteName);
  };
  const rotate = async () => {
    if (!application) return;
    await rotateEffect.rotate(application, spriteName);
  };
  return {
    rotate,
    startCrop,
    stopCrop,
    startBlur,
    stopBlur,
    startResize,
    stopResize,
  };
}
