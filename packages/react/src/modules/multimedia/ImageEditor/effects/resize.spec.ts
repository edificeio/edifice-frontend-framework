import * as PIXI from 'pixi.js';
import { save, start, stop } from './resize';

const SPRITE_NAME = 'image';
const CONTROL_NAME = 'CONTROL_NAME';
const cornerName = (corner: string) => `RESIZE_CORNER_${corner}`;

/** Real PIXI display objects, only the renderer and the canvas are doubles. */
function makeApplication({
  withSprite = true,
  rotation = 0,
}: { withSprite?: boolean; rotation?: number } = {}) {
  const stage = new PIXI.Container();

  if (withSprite) {
    const sprite = new PIXI.Sprite(
      new PIXI.Texture({
        source: new PIXI.TextureSource({ width: 200, height: 100 }),
      }),
    );
    sprite.label = SPRITE_NAME;
    sprite.rotation = rotation;
    stage.addChild(sprite);
  }

  const application = {
    stage,
    render: vi.fn(),
    renderer: {
      resize: vi.fn(),
      generateTexture: vi.fn(
        () =>
          new PIXI.Texture({
            source: new PIXI.TextureSource({ width: 200, height: 100 }),
          }),
      ),
    },
    canvas: { width: 200, getBoundingClientRect: () => ({ width: 200 }) },
  };

  return application as unknown as PIXI.Application & {
    render: ReturnType<typeof vi.fn>;
    renderer: { generateTexture: ReturnType<typeof vi.fn> };
  };
}

const control = (application: PIXI.Application) =>
  application.stage.getChildByLabel(CONTROL_NAME, true) as PIXI.Container;

function dragCorner(
  application: PIXI.Application,
  corner: string,
  to: { x: number; y: number },
) {
  const handle = application.stage.getChildByLabel(cornerName(corner), true)!;
  handle.emit('pointerdown');
  application.stage.emit('pointermove', {
    global: new PIXI.Point(to.x, to.y),
  } as never);
  return handle;
}

describe('resize effect', () => {
  describe('start', () => {
    it('draws the control container and its four corners', () => {
      const application = makeApplication();

      start(application, SPRITE_NAME);

      expect(control(application)).not.toBeNull();
      ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].forEach(
        (corner) =>
          expect(
            application.stage.getChildByLabel(cornerName(corner), true),
          ).not.toBeNull(),
      );
    });

    it('hides the original content behind the cloned stage', () => {
      const application = makeApplication();
      const sprite = application.stage.getChildByLabel(SPRITE_NAME, true)!;

      start(application, SPRITE_NAME);

      expect(sprite.alpha).toBe(0);
    });

    it('opens the stage to pointer interaction', () => {
      const application = makeApplication();

      start(application, SPRITE_NAME);

      expect(application.stage.interactive).toBe(true);
      expect(control(application).interactiveChildren).toBe(true);
    });

    it('places the corners on the container bounds', () => {
      const application = makeApplication();

      start(application, SPRITE_NAME);

      const topLeft = application.stage.getChildByLabel(
        cornerName('TOP_LEFT'),
        true,
      )!;
      const bottomRight = application.stage.getChildByLabel(
        cornerName('BOTTOM_RIGHT'),
        true,
      )!;

      expect([topLeft.position.x, topLeft.position.y]).toEqual([0, 0]);
      // The container size comes from a Graphics bounds, hence the float noise.
      expect(bottomRight.position.x).toBeCloseTo(200);
      expect(bottomRight.position.y).toBeCloseTo(100);
    });

    it('draws nothing without a sprite to resize', () => {
      const application = makeApplication({ withSprite: false });

      start(application, SPRITE_NAME);

      expect(control(application)).toBeNull();
      expect(
        application.stage.getChildByLabel(cornerName('TOP_LEFT'), true),
      ).toBeNull();
    });

    it('redraws a single control when called twice', () => {
      const application = makeApplication();

      start(application, SPRITE_NAME);
      start(application, SPRITE_NAME);

      expect(
        application.stage.children.filter(
          (child) => child.label === CONTROL_NAME,
        ),
      ).toHaveLength(1);
    });
  });

  describe('stop', () => {
    it('removes the control, restores the content and renders again', () => {
      const application = makeApplication();
      const sprite = application.stage.getChildByLabel(SPRITE_NAME, true)!;
      start(application, SPRITE_NAME);

      stop(application);

      expect(control(application)).toBeNull();
      expect(sprite.alpha).toBe(1);
      expect(application.render).toHaveBeenCalled();
    });

    it('is harmless when nothing was drawn', () => {
      const application = makeApplication();

      expect(() => stop(application)).not.toThrow();
    });
  });

  describe('dragging a corner', () => {
    it('ignores a pointer move before any pointer down', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);
      const before = control(application).width;

      application.stage.emit('pointermove', {
        global: new PIXI.Point(50, 50),
      } as never);

      expect(control(application).width).toBe(before);
    });

    // The container keeps the image centered: each corner shrinks it
    // symmetrically, hence the 2× factor on the offsets.
    it('shrinks the container from the top-left corner', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);

      dragCorner(application, 'TOP_LEFT', { x: 20, y: 10 });

      expect([
        control(application).position.x,
        control(application).position.y,
      ]).toEqual([20, 10]);
      expect(control(application).width).toBe(160);
      expect(control(application).height).toBe(80);
    });

    it('shrinks the container from the top-right corner', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);

      dragCorner(application, 'TOP_RIGHT', { x: 180, y: 10 });

      expect(control(application).position.x).toBe(20);
      expect(control(application).width).toBe(160);
      expect(control(application).height).toBe(80);
    });

    it('shrinks the container from the bottom-left corner', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);

      dragCorner(application, 'BOTTOM_LEFT', { x: 20, y: 90 });

      expect(control(application).position.y).toBe(10);
      expect(control(application).width).toBe(160);
      expect(control(application).height).toBe(80);
    });

    it('shrinks the container from the bottom-right corner', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);

      dragCorner(application, 'BOTTOM_RIGHT', { x: 180, y: 90 });

      expect([
        control(application).position.x,
        control(application).position.y,
      ]).toEqual([20, 10]);
      expect(control(application).width).toBe(160);
      expect(control(application).height).toBe(80);
    });

    it('swaps width and height for a sprite rotated a quarter turn', () => {
      const application = makeApplication({ rotation: Math.PI / 2 });
      start(application, SPRITE_NAME);

      dragCorner(application, 'TOP_LEFT', { x: 10, y: 10 });

      // The sprite is 200×100 but rotated, so the control tracks 100×200.
      expect(control(application).width).toBe(80);
      expect(control(application).height).toBe(180);
    });

    it('stops following the pointer once it is released', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);
      dragCorner(application, 'TOP_LEFT', { x: 20, y: 10 });

      globalThis.dispatchEvent(new Event('pointerup'));
      application.stage.emit('pointermove', {
        global: new PIXI.Point(60, 40),
      } as never);

      expect(control(application).position.x).toBe(20);
    });

    it('stops resizing once the sprite has left the stage', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);
      const handle = application.stage.getChildByLabel(
        cornerName('TOP_LEFT'),
        true,
      )!;
      handle.emit('pointerdown');
      application.stage.getChildByLabel(SPRITE_NAME, true)!.removeFromParent();

      expect(() =>
        application.stage.emit('pointermove', {
          global: new PIXI.Point(20, 10),
        } as never),
      ).not.toThrow();
    });
  });

  describe('save', () => {
    it('returns a sprite scaled to the control size and cleans up', () => {
      const application = makeApplication();
      start(application, SPRITE_NAME);
      dragCorner(application, 'TOP_LEFT', { x: 20, y: 10 });

      const resized = save(application);

      expect(resized).toBeInstanceOf(PIXI.Sprite);
      expect([resized!.width, resized!.height]).toEqual([160, 80]);
      expect(control(application)).toBeNull();
    });

    it('returns nothing when no control was drawn', () => {
      const application = makeApplication();

      expect(save(application)).toBeUndefined();
    });
  });
});
