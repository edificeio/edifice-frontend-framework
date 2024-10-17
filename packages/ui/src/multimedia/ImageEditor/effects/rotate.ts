import * as PIXI from 'pixi.js';

import {
  createImageSettings,
  resizeStage,
  toBlob,
  updateImageFromBlob,
} from './misc';

/**
 * This function rotate the sprite by adding PI/2
 *
 * @param application The PIXI.Application context
 * @param spriteName The name of the sprite representing the image
 */
export async function rotate(
  application: PIXI.Application,
  spriteName: string,
): Promise<void> {
  const sprite = application?.stage.getChildByName(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  if (application && sprite) {
    if (!application) return undefined;
    // create blob
    const blobBefore = await toBlob(application);
    // replace sprite using blob
    const mergedSprite = await updateImageFromBlob(application, {
      imgDatasource: blobBefore,
      spriteName,
      settings: createImageSettings({ application, sprite }),
    });
    if (!mergedSprite) {
      return;
    }
    // fix maxHeight to avoid resize modal
    let backupOldMaxHeight: string | undefined = undefined;
    let backupOldVisibility: string | undefined = undefined;
    const canvas = application.view as any as HTMLElement;
    if (canvas.style) {
      backupOldMaxHeight = canvas.style.maxHeight ?? '';
      backupOldVisibility = canvas.style.visibility ?? '';
      canvas.style.maxHeight = `${canvas.clientHeight}px`;
      canvas.style.visibility = 'hidden';
    }
    // rotate
    mergedSprite.rotation += Math.PI / 2;
    resizeStage({
      application,
      sprite: mergedSprite,
      newHeight: mergedSprite.width,
      newWidth: mergedSprite.height,
    });
    // render
    application.render();
    // create blob
    const blobAfter = await toBlob(application);
    // restore maxHeight (could be empty string)
    if (backupOldMaxHeight !== undefined) {
      canvas.style.maxHeight = backupOldMaxHeight;
    }
    // restore visibility (could be empty string....)
    if (backupOldVisibility !== undefined) {
      canvas.style.visibility = backupOldVisibility;
    }
    // replace sprite using blob
    await updateImageFromBlob(application, {
      imgDatasource: blobAfter,
      spriteName,
    });
  }
}
