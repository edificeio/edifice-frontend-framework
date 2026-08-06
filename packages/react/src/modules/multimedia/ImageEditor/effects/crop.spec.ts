import * as PIXI from 'pixi.js';
import { save, start, stop } from './crop';

const SPRITE_NAME = 'image';
const CROP_BACKGROUND_NAME = 'CROP_BACKGROUND_NAME';
const CROP_MASK_NAME = 'CROP_MASK_NAME';
const cornerName = (corner: string) => `CROP_CORNER_${corner}`;

/** Real PIXI display objects, only the renderer and the canvas are doubles. */
function makeApplication({ withSprite = true }: { withSprite?: boolean } = {}) {
  const stage = new PIXI.Container();

  if (withSprite) {
    const sprite = new PIXI.Sprite(
      new PIXI.Texture({
        source: new PIXI.TextureSource({ width: 200, height: 100 }),
      }),
    );
    sprite.label = SPRITE_NAME;
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

const background = (application: PIXI.Application) =>
  application.stage.getChildByLabel(CROP_BACKGROUND_NAME, true);
const mask = (application: PIXI.Application) =>
  application.stage.getChildByLabel(CROP_MASK_NAME, true) as PIXI.Graphics;

describe('crop effect', () => {
  describe('start', () => {
    it('draws the backdrop, the mask and the four corners', () => {
      const application = makeApplication();

      start(application, { spriteName: SPRITE_NAME });

      expect(background(application)).not.toBeNull();
      expect(mask(application)).not.toBeNull();
      ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].forEach(
        (corner) =>
          expect(
            application.stage.getChildByLabel(cornerName(corner), true),
          ).not.toBeNull(),
      );
    });

    it('opens the stage to pointer interaction', () => {
      const application = makeApplication();

      start(application, { spriteName: SPRITE_NAME });

      expect(application.stage.interactive).toBe(true);
      expect(application.stage.interactiveChildren).toBe(true);
    });

    it('positions the corners on the mask bounds', () => {
      const application = makeApplication();

      start(application, { spriteName: SPRITE_NAME });

      const topLeft = application.stage.getChildByLabel(
        cornerName('TOP_LEFT'),
        true,
      )!;
      const bottomRight = application.stage.getChildByLabel(
        cornerName('BOTTOM_RIGHT'),
        true,
      )!;

      expect([topLeft.position.x, topLeft.position.y]).toEqual([0, 0]);
      expect([bottomRight.position.x, bottomRight.position.y]).toEqual([
        200, 100,
      ]);
    });

    it('draws nothing without a sprite to crop', () => {
      const application = makeApplication({ withSprite: false });

      start(application, { spriteName: SPRITE_NAME });

      expect(background(application)).toBeNull();
      expect(
        application.stage.getChildByLabel(cornerName('TOP_LEFT'), true),
      ).toBeNull();
    });

    it('redraws from scratch when called twice', () => {
      const application = makeApplication();

      start(application, { spriteName: SPRITE_NAME });
      start(application, { spriteName: SPRITE_NAME });

      expect(
        application.stage.children.filter(
          (child) => child.label === CROP_BACKGROUND_NAME,
        ),
      ).toHaveLength(1);
    });
  });

  describe('stop', () => {
    it('removes the overlay and renders again', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      stop(application);

      expect(background(application)).toBeNull();
      expect(application.render).toHaveBeenCalled();
    });

    it('is harmless when nothing was drawn', () => {
      const application = makeApplication();

      expect(() => stop(application)).not.toThrow();
    });
  });

  describe('dragging a corner', () => {
    function dragCorner(
      application: PIXI.Application,
      corner: string,
      to: { x: number; y: number },
    ) {
      const handle = application.stage.getChildByLabel(
        cornerName(corner),
        true,
      )!;
      handle.emit('pointerdown', {} as never);
      application.stage.emit('pointermove', {
        global: new PIXI.Point(to.x, to.y),
      } as never);
      return handle;
    }

    it('ignores a pointer move before any pointer down', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });
      const before = {
        width: mask(application).width,
        height: mask(application).height,
      };

      application.stage.emit('pointermove', {
        global: new PIXI.Point(50, 50),
      } as never);

      expect(mask(application).width).toBe(before.width);
      expect(mask(application).height).toBe(before.height);
    });

    it('shrinks the mask from the top-left corner', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      dragCorner(application, 'TOP_LEFT', { x: 20, y: 10 });

      expect(mask(application).position.x).toBe(20);
      expect(mask(application).position.y).toBe(10);
      expect(mask(application).width).toBe(180);
      expect(mask(application).height).toBe(90);
    });

    it('shrinks the mask from the top-right corner', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      dragCorner(application, 'TOP_RIGHT', { x: 150, y: 10 });

      expect(mask(application).position.y).toBe(10);
      expect(mask(application).width).toBe(150);
      expect(mask(application).height).toBe(90);
    });

    it('shrinks the mask from the bottom-left corner', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      dragCorner(application, 'BOTTOM_LEFT', { x: 20, y: 80 });

      expect(mask(application).position.x).toBe(20);
      expect(mask(application).width).toBe(180);
      expect(mask(application).height).toBe(80);
    });

    it('shrinks the mask from the bottom-right corner', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      dragCorner(application, 'BOTTOM_RIGHT', { x: 150, y: 80 });

      expect(mask(application).width).toBe(150);
      expect(mask(application).height).toBe(80);
    });

    it('stops following the pointer once it is released', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });
      dragCorner(application, 'TOP_LEFT', { x: 20, y: 10 });

      globalThis.dispatchEvent(new Event('pointerup'));
      application.stage.emit('pointermove', {
        global: new PIXI.Point(60, 40),
      } as never);

      expect(mask(application).position.x).toBe(20);
    });

    it('moves the corner along with the pointer', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      const handle = dragCorner(application, 'TOP_LEFT', { x: 20, y: 10 });

      expect([handle.position.x, handle.position.y]).toEqual([20, 10]);
    });
  });

  describe('save', () => {
    it('returns a sprite of the cropped area and cleans the overlay up', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      const cropped = save(application);

      expect(cropped).toBeInstanceOf(PIXI.Sprite);
      expect(application.renderer.generateTexture).toHaveBeenCalledWith(
        expect.objectContaining({ frame: expect.any(PIXI.Rectangle) }),
      );
      expect(background(application)).toBeNull();
    });

    it('crops the region the mask was dragged to', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });
      const handle = application.stage.getChildByLabel(
        cornerName('TOP_LEFT'),
        true,
      )!;
      handle.emit('pointerdown', {} as never);
      application.stage.emit('pointermove', {
        global: new PIXI.Point(20, 10),
      } as never);

      save(application);

      // The first call comes from drawBackground; the crop frame is the last one.
      const { frame } =
        application.renderer.generateTexture.mock.calls.at(-1)![0];
      expect([frame.x, frame.y, frame.width, frame.height]).toEqual([
        20, 10, 180, 90,
      ]);
    });

    it('returns nothing when no crop area was defined', () => {
      const application = makeApplication();

      expect(save(application)).toBeUndefined();
      expect(application.renderer.generateTexture).not.toHaveBeenCalled();
    });
  });

  describe('defensive guards', () => {
    it('stops moving the mask once it has been removed from the stage', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });
      const handle = application.stage.getChildByLabel(
        cornerName('TOP_LEFT'),
        true,
      )!;
      handle.emit('pointerdown', {} as never);
      mask(application).removeFromParent();

      expect(() =>
        application.stage.emit('pointermove', {
          global: new PIXI.Point(20, 10),
        } as never),
      ).not.toThrow();
    });

    it('skips a corner that is no longer on the stage while repositioning', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });
      application.stage
        .getChildByLabel(cornerName('TOP_RIGHT'), true)!
        .removeFromParent();

      const handle = application.stage.getChildByLabel(
        cornerName('TOP_LEFT'),
        true,
      )!;
      handle.emit('pointerdown', {} as never);
      application.stage.emit('pointermove', {
        global: new PIXI.Point(20, 10),
      } as never);

      expect(mask(application).position.x).toBe(20);
      expect(
        application.stage.getChildByLabel(cornerName('TOP_RIGHT'), true),
      ).toBeNull();
    });
  });
});
