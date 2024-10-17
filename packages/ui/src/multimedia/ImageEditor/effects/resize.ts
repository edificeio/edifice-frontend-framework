import * as PIXI from 'pixi.js';

//
// Global constants used for crop effects
//

// Define the radius (pixel) of the corner
const POINT_RADIUS = 20;
// Define the name of the graphical controls
const CONTROL_NAME = 'CONTROL_NAME';
// Union type to identify corners
type CornerType = 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';

//
// Implementation
//

/**
 * This function generate names for corner objects
 * @param corner COrnerType identifying one corner
 * @returns A name identifying the corner object
 */
function getCornerName(index: CornerType) {
  return 'RESIZE_CORNER_' + index;
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
function computeCornerPosition(position: CornerType, sprite: PIXI.Graphics) {
  const left = sprite.x;
  const top = sprite.y;
  switch (position) {
    case 'TOP_LEFT': {
      return { x: left, y: top, start: 0, end: Math.PI / 2 };
    }
    case 'TOP_RIGHT': {
      return {
        x: left + sprite.width,
        y: top,
        start: Math.PI / 2,
        end: Math.PI,
      };
    }
    case 'BOTTOM_LEFT': {
      return {
        x: left,
        y: top + sprite.height,
        start: (3 * Math.PI) / 2,
        end: 2 * Math.PI,
      };
    }
    case 'BOTTOM_RIGHT': {
      return {
        x: left + sprite.width,
        y: top + sprite.height,
        start: Math.PI,
        end: (3 * Math.PI) / 2,
      };
    }
  }
}

/**
 * This function resize container when the corner move
 *
 * @param application the PIXI.Application context
 * @param arg.container  The container that materialize the controls graphical object
 * @param arg.cornerType The identifier the corner that moved
 * @param arg.position The new coordinate (x,y) of the corner
 * @param arg.spriteName The name of the sprite in the Application context
 */
function resizeContainer(
  application: PIXI.Application,
  {
    container,
    cornerType,
    position,
    spriteName,
  }: {
    spriteName: string;
    cornerType: CornerType;
    position: { x: number; y: number };
    container: PIXI.Graphics;
  },
): void {
  const sprite = application.stage.getChildByName(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  if (sprite === undefined || sprite === null) return;
  // Check whether sprite has been rotated
  const isRotated = sprite.rotation % Math.PI !== 0;
  // If sprite is rotated a multiple of 90°=>width and height are swapped
  const spriteWidth = isRotated ? sprite.height : sprite.width;
  const spriteHeight = isRotated ? sprite.width : sprite.height;
  switch (cornerType) {
    case 'TOP_LEFT': {
      container.position = new PIXI.Point(position.x, position.y);
      container.width = spriteWidth - 2 * position.x;
      container.height = spriteHeight - 2 * position.y;
      break;
    }
    case 'TOP_RIGHT': {
      const newX = spriteWidth - position.x;
      container.position = new PIXI.Point(newX, position.y);
      container.width = spriteWidth - 2 * newX;
      container.height = spriteHeight - 2 * position.y;
      break;
    }
    case 'BOTTOM_LEFT': {
      const newY = spriteHeight - position.y;
      container.position = new PIXI.Point(position.x, newY);
      container.width = spriteWidth - 2 * position.x;
      container.height = spriteHeight - 2 * newY;
      break;
    }
    case 'BOTTOM_RIGHT': {
      const newY = spriteHeight - position.y;
      const newX = spriteWidth - position.x;
      container.position = new PIXI.Point(newX, newY);
      container.width = spriteWidth - 2 * newX;
      container.height = spriteHeight - 2 * newY;
      break;
    }
  }
}
/**
 * This function remove the corner using identifier
 * If corner does not exists the function do nothing
 *
 * @param application the PIXI.Application context
 * @param cornerType identifier of the corner to remove
 */
function removeCorner(
  application: PIXI.Application,
  cornerType: CornerType,
): void {
  const previous = application.stage.getChildByName(
    getCornerName(cornerType),
    true,
  );
  previous?.removeFromParent();
}
/**
 * This function draw corner inside the control container
 *
 * @param application the PIXI.Application context
 * @param cornerType identifier of the corner to draw
 * @param args.spriteName the name of the sprite in the context
 */
function drawCorner(
  application: PIXI.Application,
  cornerType: CornerType,
  { spriteName }: { spriteName: string },
) {
  // Delete corner before redraw if needed
  removeCorner(application, cornerType);
  // Search for sprite
  const sprite = application.stage.getChildByName(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  // Search for container
  const container = application.stage.getChildByName(
    CONTROL_NAME,
    true,
  ) as PIXI.Graphics | null;
  if (
    sprite === null ||
    sprite === undefined ||
    container === null ||
    container === undefined
  )
    return;
  // Compute position of the container
  const position = computeCornerPosition(cornerType, container);
  // Draw and add the corner
  const corner = new PIXI.Graphics();
  corner.beginFill(0x4bafd5, 1);
  corner.arc(0, 0, POINT_RADIUS, position.start, position.end);
  corner.lineTo(0, 0);
  corner.endFill();
  corner.position = new PIXI.Point(position.x, position.y);
  corner.name = getCornerName(cornerType);
  // Add listener to redraw container while moving corner
  corner.interactive = true;
  let enable = false;
  application.stage.on('pointermove', (event: PIXI.FederatedMouseEvent) => {
    if (enable === false) return;
    const localPosition = application.stage.toLocal(event.global);
    resizeContainer(application, {
      cornerType,
      position: localPosition,
      container,
      spriteName,
    });
  });
  // stop tracking on pointer up
  const handlePointerUp = () => {
    enable = false;
  };
  globalThis.addEventListener('pointerup', handlePointerUp);
  // stop listening pointerup when corner is destroyed
  corner.once('destroyed', () => {
    // cancel listener
    corner.off('pointerdown');
    globalThis.removeEventListener('pointerup', handlePointerUp);
  });
  // Enable tracking on pointerdown
  const handlePointerDown = () => {
    enable = true;
  };
  corner.on('pointerdown', handlePointerDown);
  // add to sprite
  container.addChild(corner);
}

/**
 * This function draw the container if sprite exists in the Application context
 * The container contains all corners and has the same size as the sprite
 *
 * @param application the PIXI.Application context
 * @param spriteName the name of the sprite object in the context
 */
function drawContainer(
  application: PIXI.Application,
  spriteName: string,
): void {
  removeContainer(application);
  const sprite = application.stage.getChildByName(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  if (sprite === null || sprite === undefined) return;
  // Clone the stage
  const stageTexture = application.renderer.generateTexture(application.stage);
  const clonedStage = new PIXI.Sprite(stageTexture);
  // Hide all children (including original sprite)
  application.stage.children.forEach((child) => {
    child.alpha = 0;
  });
  // Draw and add the container
  const container = new PIXI.Graphics();
  container.drawRect(0, 0, sprite.width, sprite.height);
  container.name = CONTROL_NAME;
  container.interactive = true;
  container.interactiveChildren = true;
  application.stage.interactive = true;
  application.stage.interactiveChildren = true;
  application.stage.addChild(container);
  container.addChild(clonedStage);
}
/**
 * This function remove the container if exists
 * @param application the PIXI.Application context
 */
function removeContainer(application: PIXI.Application): void {
  const container = application.stage.getChildByName(
    CONTROL_NAME,
    true,
  ) as PIXI.Graphics | null;
  container?.removeFromParent();
  // display all child
  application.stage.children.forEach((child) => {
    child.alpha = 1;
  });
}
/**
 * Draw all control graphical objects: container + 4 corners
 *
 * @param application the PIXI.Application context
 * @param spriteName the name of the sprite representing the image
 */
function drawControl(application: PIXI.Application, spriteName: string): void {
  drawContainer(application, spriteName);
  drawCorner(application, 'BOTTOM_LEFT', { spriteName });
  drawCorner(application, 'BOTTOM_RIGHT', { spriteName });
  drawCorner(application, 'TOP_LEFT', { spriteName });
  drawCorner(application, 'TOP_RIGHT', { spriteName });
}
/**
 * Remove all control graphical objects if exists : container + 4 corners
 *
 * @param application the PIXI.Application context
 */
function removeControl(application: PIXI.Application): void {
  removeContainer(application);
  removeCorner(application, 'BOTTOM_LEFT');
  removeCorner(application, 'BOTTOM_RIGHT');
  removeCorner(application, 'TOP_LEFT');
  removeCorner(application, 'TOP_RIGHT');
  application.stage.off('pointermove');
}
/**
 * Draw all graphical object to control the resize
 *
 * @param application the PIXI.Application context
 * @param spriteName the name of the sprite representing the image
 */
export function start(application: PIXI.Application, spriteName: string): void {
  drawControl(application, spriteName);
}
/**
 * If {saveChanges} is true remove all graphical controls then resize the sprite
 * If {saveChanges} is false remove all graphical controls and keep original size
 *
 * @param application the PIXI.Application context
 * @param param.saveChanges true if we should save the resize
 * @param param.spriteName the name of the sprite representing the original image
 */
export function stop(application: PIXI.Application): void {
  removeControl(application);
  application.stage.off('pointermove');
  application.render();
}
/**
 *
 * @param application the PIXI.Application context
 * @param spriteName  the name of the sprite representing the image
 * @param size the target size of the image {width, height}
 * @returns a PIXI.Sprite with a image resized or undefined if not found
 */
export function save(application: PIXI.Application): PIXI.Sprite | undefined {
  // Search for container
  const container = application?.stage?.getChildByName(
    CONTROL_NAME,
    true,
  ) as PIXI.Graphics | null;
  // Get target size
  const size = container
    ? { height: container.height, width: container.width }
    : undefined;
  // Remove graphic control
  removeControl(application);
  if (size) {
    // Clone stage
    const stageTexture = application.renderer
      .generateTexture(application.stage)
      .clone();
    const clonedStage = new PIXI.Sprite(stageTexture);
    // Apply new size to the stage
    clonedStage.width = size.width;
    clonedStage.height = size.height;
    return clonedStage;
  } else {
    return undefined;
  }
}
