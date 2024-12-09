import * as PIXI from 'pixi.js';

import { aggregate } from '../utilities/aggregate';
import { getApplicationScale } from './misc';

//
// Global constants used for crop effects
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
 * This function draw brush  graphical object for each points
 *
 * @param points a list of PIXI.Point used to draw brush
 * @returns a graphical object that draw brush for each of theses points
 */
function drawBrush(
  points: Array<PIXI.Point | undefined>,
  scale: number,
): PIXI.Graphics {
  const container = new PIXI.Graphics();
  for (const point of points) {
    if (point) {
      container.beginFill(0xffffff, 1);
      container.drawCircle(point.x, point.y, BRUSH_SIZE / scale);
      container.lineStyle(0);
      container.endFill();
    }
  }
  return container;
}

/**
 * This function create a mouse event listener that merge and aggregate mouse events
 * The aggregated events are used to draw brush and apply blur filter to the stage
 * If the spriteName has not been found in the context, the listener do nothing
 *
 * @param application The PIXI.Application context
 * @param {spriteName} arg The name of the sprite identifying the original image
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
      const child = application.stage.getChildByName(spriteName);
      const scale = getApplicationScale(application);
      if (child === undefined || child === null) return;
      // Create a sprite by copying texture and apply blurFilter
      const newSprite = new PIXI.Sprite((child as PIXI.Sprite).texture);
      // Apply blur filter to the new sprite, quality for big image (fix lag issue)

      newSprite.filters = [
        new PIXI.BlurFilter(
          8, // PIXI Default value for strength of the blur effect
          (Math.min(Math.round(4 * scale)), 4), // Quality of the blur effect depending on the scale (4 is the PIXI default value)
          Math.min(scale, 1), // Resolution of the blur effect depending on the scale
        ),
      ];
      newSprite.width = (child as PIXI.Sprite).width;
      newSprite.height = (child as PIXI.Sprite).height;
      // Resize the new sprite to match the original
      newSprite.scale = new PIXI.Point(1, 1);
      newSprite.anchor = (child as PIXI.Sprite).anchor;
      newSprite.mask = drawBrush(points, scale);
      (child as PIXI.Sprite).addChild(newSprite);
    },
  );
}
/**
 * This function draw the graphical cursor use to apply the blur effect
 *
 * @param application The PIXI.Application context
 * @returns the PIXI.Graphics object representing the cursor
 */
function drawCursor(application: PIXI.Application): PIXI.Graphics {
  // Remove cursor if exists before draw
  removeCursor(application);
  const scale = getApplicationScale(application);
  const circle = new PIXI.Graphics();
  circle.lineStyle(Math.max(1, 1 / scale), 0xff0000);
  circle.drawCircle(0, 0, BRUSH_SIZE / scale);
  circle.endFill();
  circle.name = CURSOR_NAME;
  application.stage.addChild(circle);
  return circle;
}
/**
 * This function remove cursor if exists in context
 *
 * @param application The PIXI.Application context
 */
function removeCursor(application: PIXI.Application) {
  const child = application.stage.getChildByName(CURSOR_NAME);
  if (child) {
    child.removeFromParent();
  }
}
/**
 *  Move the cursor graphical controler while mouse is moving
 *
 * @param application the PIXI.Application context
 * @returns A mouse event listener
 */
function moveCursorListener(application: PIXI.Application) {
  return (event: PIXI.FederatedMouseEvent) => {
    if (!application) return;
    const point = application.stage.toLocal(event.global);
    const child = application.stage.getChildByName(CURSOR_NAME, true);
    if (child) {
      child.position.x = point.x;
      child.position.y = point.y;
    }
  };
}
/**
 * This function start the blur controler
 * - drawing cursor
 * - listening mouse move to move cursor
 * - listening
 *
 * @param application
 * @param param1
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
 * This function remove cursor and all mouse event listeners
 *
 * @param application the PIXI.Application context
 */
export function stop(application: PIXI.Application): void {
  removeCursor(application);
  application.stage.off('pointerdown');
  application.stage.off('pointermove');
}
