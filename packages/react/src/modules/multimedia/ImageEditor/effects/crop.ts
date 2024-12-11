import * as PIXI from 'pixi.js';

import { getApplicationScale } from './misc';

//
// Global constants used for crop effects
//

// Union type to identify corners
export type CornerType =
  | 'TOP_LEFT'
  | 'TOP_RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT';
// List of available corners
const CORNERS: Array<CornerType> = [
  'TOP_LEFT',
  'TOP_RIGHT',
  'BOTTOM_LEFT',
  'BOTTOM_RIGHT',
];
// Define initial padding (pixel) between anchors and image corners
const PADDING = 0;
// Define the radius (pixel) of the corner control
const POINT_RADIUS = 20;
// Define the name of the background backdrop applied while we are cropping
const CROP_BACKGROUND_NAME = 'CROP_BACKGROUND_NAME';
// Define the name of the mask (crop) applied to the final image
const CROP_MASK_NAME = 'CROP_MASK_NAME';

//
// Implementation
//

/**
 * This function generate names for corner objects
 * @param corner COrnerType identifying one corner
 * @returns A name identifying the corner object
 */
function getCornerName(corner: CornerType) {
  return 'CROP_CORNER_' + corner;
}
/**
 * This function draw background having:
 * - a backdrop with 0.5 opacity over the initial image
 * - a duplicate texture of the initial stage
 * - a rectangle/mask applied to the cloned texture
 *
 * If the sprite does not exists in this context this function do nothing
 *
 * @param application The PIXI.Application context
 * @param {spriteName:string} {spriteName} The name of the sprite in the context
 */
function drawBackground(
  application: PIXI.Application,
  { spriteName }: { spriteName: string },
): void {
  removeBackground(application);
  const sprite = application.stage.getChildByName(
    spriteName,
  ) as PIXI.Sprite | null;
  if (sprite === null || sprite === undefined) return;
  const spriteBounds = sprite.getBounds();
  // Clone the stage
  const stageTexture = application.renderer
    .generateTexture(application.stage)
    .clone();
  const clonedStage = new PIXI.Sprite(stageTexture);
  clonedStage.height = spriteBounds.height;
  clonedStage.width = spriteBounds.width;
  clonedStage.position = new PIXI.Point(0, 0);
  // Draw the background
  const background = new PIXI.Graphics();
  background.beginFill(0xffffff, 0.5);
  background.drawRect(0, 0, spriteBounds.width, spriteBounds.height);
  background.endFill();
  background.name = CROP_BACKGROUND_NAME;
  background.position = new PIXI.Point(spriteBounds.x, spriteBounds.y);
  // Draw the mask to apply to the cloned stage
  const rectMask = new PIXI.Graphics();
  rectMask.beginFill(0x000000, 1);
  rectMask.drawRect(
    0,
    0,
    spriteBounds.width - 2 * PADDING,
    spriteBounds.height - 2 * PADDING,
  );
  rectMask.endFill();
  rectMask.position = new PIXI.Point(PADDING, PADDING);
  rectMask.name = CROP_MASK_NAME;
  // Apply the mask to the cloned stage and add children
  clonedStage.mask = rectMask;
  application.stage.addChild(background);
  background.addChild(rectMask);
  background.addChild(clonedStage);
}
/**
 * This function remove the background with all his children (corners, backdrop and cloned stage)
 * If the background does not exists this function do nothing
 *
 * @param application The PIXI.Application context
 */
function removeBackground(application: PIXI.Application): void {
  const child = application.stage.getChildByName(CROP_BACKGROUND_NAME, true);
  child?.removeFromParent();
}
/**
 * This function compute coordinate (x,y) and angles (start,end) of a corner according to the CornerType
 * - (x,y) are coordinate of the corner in pixel relative to the parent
 * - (start, end) are angles between 0 and 2PI used to draw the corner relative using the Arc tool
 *
 * @param cornerType a CornerType for which we want to compute angles and coordinates
 * @param bounds bounds of the Cropped Texture (which is also the parent of the corner)
 * @returns the coordinates and the angles
 */
function computeCornerPosition(
  cornerType: CornerType,
  bounds: { x: number; y: number; width: number; height: number },
): { x: number; y: number; start: number; end: number } {
  switch (cornerType) {
    case 'TOP_LEFT': {
      return { x: bounds.x, y: bounds.y, start: 0, end: Math.PI / 2 };
    }
    case 'TOP_RIGHT': {
      return {
        x: bounds.x + bounds.width,
        y: bounds.y,
        start: Math.PI / 2,
        end: Math.PI,
      };
    }
    case 'BOTTOM_LEFT': {
      return {
        x: bounds.x,
        y: bounds.y + bounds.height,
        start: (3 * Math.PI) / 2,
        end: 2 * Math.PI,
      };
    }
    case 'BOTTOM_RIGHT': {
      return {
        x: bounds.x + bounds.width,
        y: bounds.y + bounds.height,
        start: Math.PI,
        end: (3 * Math.PI) / 2,
      };
    }
  }
}
/**
 * This function reposition all corners according the bounds of the mask
 * If the mask has not been found in this context this function do nothing
 *
 * @param application  The PIXI.Application context
 */
function refreshCorners(application: PIXI.Application): void {
  const mask = application.stage.getChildByName(
    CROP_MASK_NAME,
    true,
  ) as PIXI.Graphics | null;
  if (mask === undefined || mask === null) return;
  CORNERS.forEach((cornerType) => {
    const corner = application.stage.getChildByName(
      getCornerName(cornerType),
      true,
    );
    if (corner === undefined || corner === null) return;
    const position = computeCornerPosition(cornerType, {
      height: mask.height,
      width: mask.width,
      x: mask.x,
      y: mask.y,
    });
    corner.position = new PIXI.Point(position.x, position.y);
  });
}
/**
 * This function draw one corner according to his type.
 * It also binds mouse events to move mask according when the corner move
 *
 * @param application The PIXI.Application context
 * @param cornerType The cornerType identifying the corner we are drawing
 * @param { spriteName:string } {spriteName} The sprite name identifying the original image
 */
function drawCorner(
  application: PIXI.Application,
  cornerType: CornerType,
  { spriteName }: { spriteName: string },
): void {
  // Delete corner if exists before redrawing
  const previous = application.stage.getChildByName(
    getCornerName(cornerType),
    true,
  );
  const scale = getApplicationScale(application);
  previous?.removeFromParent();
  // Search for background
  const background = application.stage.getChildByName(
    CROP_BACKGROUND_NAME,
    true,
  ) as PIXI.Graphics | null;
  // Search for mask
  const mask = application.stage.getChildByName(
    CROP_MASK_NAME,
    true,
  ) as PIXI.Graphics | null;
  // Search for sprite
  const sprite = application.stage.getChildByName(
    spriteName,
  ) as PIXI.Sprite | null;
  if (
    sprite === null ||
    sprite === undefined ||
    background === null ||
    background === undefined ||
    mask === undefined ||
    mask === null
  ) {
    return;
  }
  // Compute corner position
  const position = computeCornerPosition(cornerType, {
    height: mask.height,
    width: mask.width,
    x: mask.x,
    y: mask.y,
  });
  //Draw corner
  const corner = new PIXI.Graphics();
  corner.beginFill(0x4bafd5, 1);
  corner.arc(0, 0, POINT_RADIUS / scale, position.start, position.end);
  corner.lineTo(0, 0);
  corner.endFill();
  corner.position = new PIXI.Point(position.x, position.y);
  corner.name = getCornerName(cornerType);
  corner.interactive = true;
  // Add mouse event move => on corner move redraw mask
  let enable = false;
  application.stage.on('pointermove', (event: PIXI.FederatedMouseEvent) => {
    if (enable === false) return;
    const localPosition = background.toLocal(event.global);
    corner.position.x = localPosition.x;
    corner.position.y = localPosition.y;
    moveMask(application, cornerType, localPosition);
  });
  // Add mouse down event => on pointer down start moving mask
  const handlePointerDown = () => {
    enable = true;
  };
  corner.on('pointerdown', handlePointerDown);
  // Add mouse up event => on pointer down stop moving mask
  const handlePointerUp = () => {
    enable = false;
  };
  globalThis.addEventListener('pointerup', handlePointerUp);
  // Remove listeners when corner destroyed
  corner.once('destroyed', () => {
    // cancel listener
    corner.off('pointerdown');
    globalThis.removeEventListener('pointerup', handlePointerUp);
  });
  // Add corner
  background.addChild(corner);
}
/**
 * This function move the rectangle mask used to crop the image
 * If the mask does not exists in this context the function do nothing
 *
 * @param application the PIXI.Application context
 * @param cornerType The cornerType identifying the corner that changed position
 * @param position The coordinate (x,y) of the corner that moved
 */
function moveMask(
  application: PIXI.Application,
  cornerType: CornerType,
  position: { x: number; y: number },
): void {
  const mask = application.stage.getChildByName(
    CROP_MASK_NAME,
    true,
  ) as PIXI.Graphics | null;
  if (mask === undefined || mask === null) return;
  const right = mask.position.x + mask.width;
  const bottom = mask.position.y + mask.height;
  switch (cornerType) {
    case 'TOP_LEFT': {
      mask.position.x = position.x;
      mask.position.y = position.y;
      mask.width = right - position.x;
      mask.height = bottom - position.y;
      break;
    }
    case 'TOP_RIGHT': {
      mask.position.y = position.y;
      mask.width = position.x - mask.position.x;
      mask.height = bottom - position.y;
      break;
    }
    case 'BOTTOM_LEFT': {
      mask.position.x = position.x;
      mask.width = right - position.x;
      mask.height = position.y - mask.position.y;
      break;
    }
    case 'BOTTOM_RIGHT': {
      mask.width = position.x - mask.position.x;
      mask.height = position.y - mask.position.y;
      break;
    }
  }
  refreshCorners(application);
}
/**
 * This function draw all graphics controls used to crop an image:
 * - 4 corners to select the cropped area
 * - A background with an transparent backdrop effect
 * - A mask applied to the original image
 *
 * @param application The PIXI.Application context
 * @param {spriteName:string} {spriteName} The sprite name identifying the original image
 */
export function start(
  application: PIXI.Application,
  { spriteName }: { spriteName: string },
): void {
  // Remove controls before redrawing if exists
  stop(application);
  application.stage.interactive = true;
  application.stage.interactiveChildren = true;
  drawBackground(application, { spriteName });
  drawCorner(application, 'BOTTOM_LEFT', { spriteName });
  drawCorner(application, 'BOTTOM_RIGHT', { spriteName });
  drawCorner(application, 'TOP_LEFT', { spriteName });
  drawCorner(application, 'TOP_RIGHT', { spriteName });
}
/**
 * This function remove all graphics controls if exists. And it also remove any mouse event on this stage
 *
 * @param application The PIXI.Application context
 */
export function stop(application: PIXI.Application) {
  removeBackground(application);
  application.stage.off('pointermove');
  application.render();
}
/**
 * This function apply a crop to the imageSrc and return the result as a PIXI.Sprite object
 *
 * @param application
 * @param imageSrc a string URI of the image to crop
 * @returns a PIXI.Sprite with a imageSrc cropped or undefined if the image has not been cropped
 */
export function save(application: PIXI.Application): PIXI.Sprite | undefined {
  // Search for mask in this context
  const mask = application.stage.getChildByName(
    CROP_MASK_NAME,
    true,
  ) as PIXI.Graphics | null;
  // Stop if mask does not exists
  if (mask === undefined || mask === null) return;
  // Remove controls before cloning stage
  stop(application);
  // Clone stage
  const stageTexture = application.renderer
    .generateTexture(application.stage)
    .clone();
  const clonedStage = new PIXI.Sprite(stageTexture);
  // Compute bounds and round lower to avoid overflow
  const maskBounds = mask.getBounds();
  const bounds = new PIXI.Rectangle(
    Math.floor(maskBounds.x),
    Math.floor(maskBounds.y),
    Math.floor(maskBounds.width),
    Math.floor(maskBounds.height),
  );
  // Apply crop to the cloned stage
  const cropped = new PIXI.Texture(clonedStage.texture.baseTexture, bounds);
  const sprite = new PIXI.Sprite(cropped);
  return sprite;
}
