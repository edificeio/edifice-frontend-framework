import * as PIXI from 'pixi.js';

import { aggregate } from '../utilities/aggregate';
import { BLUR_LAYER_NAME } from './constants';
import { getApplicationScale } from './misc';

//
// Global constants used for blur effects
//

// Define the radius (pixel) of the brush used to apply blur
const BRUSH_SIZE = 20;
// Define the delay (in ms) of the debounce to avoid lags
const DEBOUNCE = 50;
// Define the name of brush object in the PIXI context
const CURSOR_NAME = 'BRUSH_CURSOR';

//
// Implementation
//

/**
 * Get or create the blur layer Container in the stage.
 * Using a Container (not a Sprite) avoids the v8 deprecation warning
 * "Only Containers will be allowed to add children".
 */
function getOrCreateBlurLayer(application: PIXI.Application): PIXI.Container {
  let layer = application.stage.getChildByLabel(
    BLUR_LAYER_NAME,
  ) as PIXI.Container | null;
  if (!layer) {
    layer = new PIXI.Container();
    layer.label = BLUR_LAYER_NAME;
    application.stage.addChild(layer);
  }
  return layer;
}

/**
 * This function draws brush graphical objects for each point
 *
 * @param points a list of PIXI.Point used to draw brush
 * @returns a graphical object that draws brush for each of these points
 */
function drawBrush(
  points: Array<PIXI.Point | undefined>,
  scale: number,
): PIXI.Graphics {
  const container = new PIXI.Graphics();
  for (const point of points) {
    if (point) {
      container.circle(point.x, point.y, BRUSH_SIZE / scale);
      container.fill({ color: 0xffffff, alpha: 1 });
    }
  }
  return container;
}

/**
 * This function creates a mouse event listener that merges and aggregates mouse events.
 * The aggregated events are used to draw brush and apply blur filter to the stage.
 * If the spriteName has not been found in the context, the listener does nothing.
 *
 * @param application The PIXI.Application context
 * @param spriteName The name of the sprite identifying the original image
 * @returns A mouse event listener
 */
function drawBlurListener(
  application: PIXI.Application,
  { spriteName }: { spriteName: string },
) {
  return aggregate(
    DEBOUNCE,
    (event: PIXI.FederatedMouseEvent) => {
      return application.stage.toLocal(event.global);
    },
    (points: Array<PIXI.Point | undefined>) => {
      // Search for sprite
      const child = application.stage.getChildByLabel(spriteName);
      const scale = getApplicationScale(application);
      if (!child) return;
      const sprite = child as PIXI.Sprite;
      // Create a sprite by copying texture and apply blurFilter
      const newSprite = new PIXI.Sprite(sprite.texture);
      newSprite.filters = [
        new PIXI.BlurFilter({
          strength: 8,
          quality: Math.min(Math.round(4 * scale), 4),
          resolution: Math.min(scale, 1),
        }),
      ];
      newSprite.width = sprite.width;
      newSprite.height = sprite.height;
      newSprite.scale = new PIXI.Point(1, 1);
      newSprite.anchor = sprite.anchor;
      // Add blur sprite and its mask to the blur layer Container
      const blurLayer = getOrCreateBlurLayer(application);
      const brushMask = drawBrush(points, scale);
      blurLayer.addChild(brushMask);
      newSprite.mask = brushMask;
      blurLayer.addChild(newSprite);
    },
  );
}
/**
 * This function draws the graphical cursor used to apply the blur effect
 *
 * @param application The PIXI.Application context
 * @returns the PIXI.Graphics object representing the cursor
 */
function drawCursor(application: PIXI.Application): PIXI.Graphics {
  // Remove cursor if exists before draw
  removeCursor(application);
  const scale = getApplicationScale(application);
  const circle = new PIXI.Graphics();
  circle.circle(0, 0, BRUSH_SIZE / scale);
  circle.stroke({ width: Math.max(1, 1 / scale), color: 0xff0000 });
  circle.label = CURSOR_NAME;
  application.stage.addChild(circle);
  return circle;
}
/**
 * This function removes cursor if it exists in context
 *
 * @param application The PIXI.Application context
 */
function removeCursor(application: PIXI.Application) {
  const child = application.stage.getChildByLabel(CURSOR_NAME);
  if (child) {
    child.removeFromParent();
  }
}
/**
 * Move the cursor graphical controller while mouse is moving
 *
 * @param application the PIXI.Application context
 * @returns A mouse event listener
 */
function moveCursorListener(application: PIXI.Application) {
  return (event: PIXI.FederatedMouseEvent) => {
    if (!application) return;
    const point = application.stage.toLocal(event.global);
    const child = application.stage.getChildByLabel(CURSOR_NAME, true);
    if (child) {
      child.position.x = point.x;
      child.position.y = point.y;
    }
  };
}
/**
 * This function starts the blur controller:
 * - drawing cursor
 * - listening mouse move to move cursor
 * - listening pointer events to apply blur
 *
 * @param application The PIXI.Application context
 * @param spriteName The name of the sprite identifying the original image
 */
export function start(
  application: PIXI.Application,
  { spriteName }: { spriteName: string },
) {
  application.stage.interactive = true;
  // Draw cursor
  const cursor = drawCursor(application);
  // Apply blur effect and move cursor while mouse moving
  const cursorListener = moveCursorListener(application);
  application.stage.on('pointermove', cursorListener);
  const blurListener = drawBlurListener(application, { spriteName });
  application.stage.on('pointerdown', () => {
    // Remove first to avoid accumulating duplicate listeners on repeated clicks
    application.stage.off('pointermove', blurListener);
    application.stage.on('pointermove', blurListener);
  });
  // Stop listening move when cursor is up
  const stopListening = () => {
    application?.stage?.off('pointermove', blurListener);
  };
  globalThis.addEventListener('pointerup', stopListening);
  // Remove global listener when cursor is destroyed
  cursor.once('destroyed', () => {
    globalThis.removeEventListener('pointerup', stopListening);
  });
}
/**
 * This function removes cursor and all mouse event listeners.
 * The blur layer is kept on stage so it gets captured by toBlob/generateTexture
 * when the image is saved or another operation is applied.
 *
 * @param application the PIXI.Application context
 */
export function stop(application: PIXI.Application): void {
  removeCursor(application);
  application.stage.off('pointerdown');
  application.stage.off('pointermove');
}
