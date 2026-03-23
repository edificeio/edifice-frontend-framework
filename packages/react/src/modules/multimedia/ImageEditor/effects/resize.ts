import * as PIXI from 'pixi.js';

//
// Global constants used for resize effects
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
 * This function generates names for corner objects
 * @param index CornerType identifying one corner
 * @returns A name identifying the corner object
 */
function getCornerName(index: CornerType) {
  return 'RESIZE_CORNER_' + index;
}

/**
 * This function computes coordinate (x,y) and angles (start,end) of a corner according to the CornerType
 *
 * @param position The CornerType for which we want to compute angles and coordinates
 * @param sprite The Graphics container used to compute corner positions
 * @returns the coordinates and the angles
 */
function computeCornerPosition(position: CornerType, sprite: PIXI.Container) {
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
    container: PIXI.Container;
  },
): void {
  const sprite = application.stage.getChildByLabel(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  if (!sprite) return;
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
  const previous = application.stage.getChildByLabel(
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
  const sprite = application.stage.getChildByLabel(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  // Search for container
  const container = application.stage.getChildByLabel(
    CONTROL_NAME,
    true,
  ) as PIXI.Container | null;
  if (!sprite || !container) return;
  // Compute position of the container
  const position = computeCornerPosition(cornerType, container);
  // Draw and add the corner
  const corner = new PIXI.Graphics();
  corner.arc(0, 0, POINT_RADIUS, position.start, position.end);
  corner.lineTo(0, 0);
  corner.fill({ color: 0x4bafd5, alpha: 1 });
  corner.position = new PIXI.Point(position.x, position.y);
  corner.label = getCornerName(cornerType);
  // Add listener to redraw container while moving corner
  corner.interactive = true;
  let enable = false;
  const handlePointerMove = (event: PIXI.FederatedMouseEvent) => {
    if (!enable) return;
    const localPosition = application.stage.toLocal(event.global);
    resizeContainer(application, {
      cornerType,
      position: localPosition,
      container,
      spriteName,
    });
  };
  application.stage.on('pointermove', handlePointerMove);
  // Enable tracking on pointerdown
  const handlePointerDown = () => {
    enable = true;
  };
  corner.on('pointerdown', handlePointerDown);
  // stop tracking on pointer up
  const handlePointerUp = () => {
    enable = false;
  };
  globalThis.addEventListener('pointerup', handlePointerUp);
  // Remove all listeners when corner is destroyed
  corner.once('destroyed', () => {
    corner.off('pointerdown');
    application.stage.off('pointermove', handlePointerMove);
    globalThis.removeEventListener('pointerup', handlePointerUp);
  });
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
  const sprite = application.stage.getChildByLabel(
    spriteName,
    true,
  ) as PIXI.Sprite | null;
  if (!sprite) return;
  // Clone the stage
  const stageTexture = application.renderer.generateTexture(application.stage);
  const clonedStage = new PIXI.Sprite(stageTexture);
  // Hide all children (including original sprite)
  application.stage.children.forEach((child) => {
    child.alpha = 0;
  });
  // Create a Container to hold all resize control elements
  const container = new PIXI.Container();
  container.label = CONTROL_NAME;
  container.interactive = true;
  container.interactiveChildren = true;
  // Draw the invisible bounding rect (used for hit area and size tracking)
  const bounds = new PIXI.Graphics();
  bounds.rect(0, 0, sprite.width, sprite.height);
  bounds.fill({ color: 0x000000, alpha: 0 });
  application.stage.interactive = true;
  application.stage.interactiveChildren = true;
  application.stage.addChild(container);
  container.addChild(bounds);
  container.addChild(clonedStage);
}
/**
 * This function remove the container if exists
 * @param application the PIXI.Application context
 */
function removeContainer(application: PIXI.Application): void {
  const container = application.stage.getChildByLabel(
    CONTROL_NAME,
    true,
  ) as PIXI.Container | null;
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
 * Remove all graphical controls and mouse event listeners
 *
 * @param application the PIXI.Application context
 */
export function stop(application: PIXI.Application): void {
  removeControl(application);
  application.stage.off('pointermove');
  application.render();
}
/**
 * Apply the resize and return the result as a PIXI.Sprite
 *
 * @param application the PIXI.Application context
 * @returns a PIXI.Sprite with the resized image or undefined if no resize was applied
 */
export function save(application: PIXI.Application): PIXI.Sprite | undefined {
  // Search for container
  const container = application?.stage?.getChildByLabel(
    CONTROL_NAME,
    true,
  ) as PIXI.Container | null;
  // Get target size
  const size = container
    ? { height: container.height, width: container.width }
    : undefined;
  // Remove graphic control
  removeControl(application);
  if (size) {
    // Clone stage
    const stageTexture = application.renderer.generateTexture(
      application.stage,
    );
    const clonedStage = new PIXI.Sprite(stageTexture);
    // Apply new size to the stage
    clonedStage.width = size.width;
    clonedStage.height = size.height;
    return clonedStage;
  } else {
    return undefined;
  }
}
