import * as PIXI from 'pixi.js';
import { BLUR_LAYER_NAME } from './constants';
import { start, stop } from './blur';

const SPRITE_NAME = 'image';
const CURSOR_NAME = 'BRUSH_CURSOR';

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
    renderer: { resize: vi.fn() },
    canvas: { width: 200, getBoundingClientRect: () => ({ width: 200 }) },
  };

  return application as unknown as PIXI.Application;
}

const cursor = (application: PIXI.Application) =>
  application.stage.getChildByLabel(CURSOR_NAME, true);
const blurLayer = (application: PIXI.Application) =>
  application.stage.getChildByLabel(BLUR_LAYER_NAME) as PIXI.Container | null;

const pointerMove = (application: PIXI.Application, x: number, y: number) =>
  application.stage.emit('pointermove', {
    global: new PIXI.Point(x, y),
  } as never);

describe('blur effect', () => {
  // The brush aggregates its points over a debounce window before painting.
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('start', () => {
    it('draws the brush cursor and opens the stage to pointer events', () => {
      const application = makeApplication();

      start(application, { spriteName: SPRITE_NAME });

      expect(cursor(application)).not.toBeNull();
      expect(application.stage.interactive).toBe(true);
    });

    it('draws a single cursor when called twice', () => {
      const application = makeApplication();

      start(application, { spriteName: SPRITE_NAME });
      start(application, { spriteName: SPRITE_NAME });

      expect(
        application.stage.children.filter(
          (child) => child.label === CURSOR_NAME,
        ),
      ).toHaveLength(1);
    });

    it('moves the cursor along with the pointer', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      pointerMove(application, 42, 24);

      expect([
        cursor(application)!.position.x,
        cursor(application)!.position.y,
      ]).toEqual([42, 24]);
    });
  });

  describe('painting', () => {
    it('paints a blurred patch after the debounce window', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      pointerMove(application, 30, 30);
      vi.advanceTimersByTime(50);

      const layer = blurLayer(application);
      expect(layer).not.toBeNull();
      // One mask plus one blurred sprite per aggregated batch.
      expect(layer!.children).toHaveLength(2);
    });

    it('reuses the same blur layer across batches', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);
      pointerMove(application, 60, 60);
      vi.advanceTimersByTime(50);

      expect(
        application.stage.children.filter(
          (child) => child.label === BLUR_LAYER_NAME,
        ),
      ).toHaveLength(1);
      expect(blurLayer(application)!.children).toHaveLength(4);
    });

    it('paints nothing without a sprite to blur', () => {
      const application = makeApplication({ withSprite: false });
      start(application, { spriteName: SPRITE_NAME });

      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);

      expect(blurLayer(application)).toBeNull();
    });

    it('does not paint while the pointer is only hovering', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);

      expect(blurLayer(application)).toBeNull();
    });

    it('stops painting once the pointer is released', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);
      const painted = blurLayer(application)!.children.length;

      globalThis.dispatchEvent(new Event('pointerup'));
      pointerMove(application, 80, 80);
      vi.advanceTimersByTime(50);

      expect(blurLayer(application)!.children).toHaveLength(painted);
    });

    it('does not stack listeners on repeated clicks', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      application.stage.emit('pointerdown', {} as never);
      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);

      // A duplicated listener would paint the batch twice.
      expect(blurLayer(application)!.children).toHaveLength(2);
    });
  });

  describe('stop', () => {
    it('removes the cursor but keeps the painted blur', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });
      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);

      stop(application);

      expect(cursor(application)).toBeNull();
      expect(blurLayer(application)).not.toBeNull();
    });

    it('detaches the pointer listeners', () => {
      const application = makeApplication();
      start(application, { spriteName: SPRITE_NAME });

      stop(application);
      application.stage.emit('pointerdown', {} as never);
      pointerMove(application, 20, 20);
      vi.advanceTimersByTime(50);

      expect(blurLayer(application)).toBeNull();
    });

    it('is harmless when the blur was never started', () => {
      const application = makeApplication();

      expect(() => stop(application)).not.toThrow();
    });
  });
});
