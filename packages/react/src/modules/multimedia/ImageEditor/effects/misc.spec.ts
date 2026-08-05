import * as PIXI from 'pixi.js';
import { BLUR_LAYER_NAME } from './constants';
import {
  autoResize,
  constraintSize,
  createImageSettings,
  DEFAULT_SPRITE_NAME,
  getApplicationScale,
  ImageSettings,
  resizeStage,
  saveAsBlob,
  saveAsDataURL,
  toBlob,
  trimStage,
  updateImage,
  updateImageFromBlob,
} from './misc';

/**
 * PIXI works under jsdom as long as nothing is rendered: the stage is a real
 * Container and the sprites carry real sized textures, only the renderer and the
 * canvas are doubles.
 */
function makeSprite(width = 200, height = 100, label = DEFAULT_SPRITE_NAME) {
  const sprite = new PIXI.Sprite(
    new PIXI.Texture({ source: new PIXI.TextureSource({ width, height }) }),
  );
  sprite.label = label;
  return sprite;
}

type CanvasDouble = {
  style?: Record<string, string>;
  parentNode?: { offsetWidth: number } | null;
  width?: number;
  toBlob?: unknown;
  toDataURL?: unknown;
  getBoundingClientRect?: unknown;
};

function makeApplication(canvas: CanvasDouble = {}) {
  const stage = new PIXI.Container();
  const application = {
    stage,
    renderer: { resize: vi.fn() },
    canvas: { style: {}, parentNode: null, width: 400, ...canvas },
  };

  return application as unknown as PIXI.Application & {
    renderer: { resize: ReturnType<typeof vi.fn> };
  };
}

describe('constraintSize', () => {
  it('fits the size to the maximum width, keeping the ratio', () => {
    expect(
      constraintSize(
        { width: 1000, height: 500 },
        { width: { max: 400, min: 100 }, height: { min: 100, max: 300 } },
      ),
    ).toEqual({ width: 400, height: 200 });
  });

  it('clamps a height that would overflow the maximum', () => {
    expect(
      constraintSize(
        { width: 100, height: 1000 },
        { width: { max: 400, min: 10 }, height: { min: 10, max: 200 } },
      ),
    ).toEqual({ width: 20, height: 200 });
  });

  it('raises a width below the minimum', () => {
    expect(
      constraintSize(
        { width: 10, height: 10 },
        { width: { max: 40, min: 80 }, height: { min: 10, max: 400 } },
      ),
    ).toEqual({ width: 80, height: 80 });
  });

  it('raises a height below the minimum', () => {
    expect(
      constraintSize(
        { width: 400, height: 10 },
        { width: { max: 400, min: 10 }, height: { min: 100, max: 400 } },
      ),
    ).toEqual({ width: 4000, height: 100 });
  });
});

describe('createImageSettings', () => {
  it('snapshots the sprite and the stage geometry', () => {
    const application = makeApplication();
    const sprite = makeSprite();
    sprite.rotation = Math.PI / 2;
    sprite.position.set(10, 20);
    sprite.anchor.set(0.5, 0.5);
    application.stage.addChild(sprite);

    const settings = createImageSettings({ application, sprite });

    expect(settings.sprite).toMatchObject({
      rotation: Math.PI / 2,
      size: { width: 200, height: 100 },
      position: { x: 10, y: 20 },
      anchor: { x: 0.5, y: 0.5 },
    });
    expect(settings.stage.size).toEqual({
      width: application.stage.width,
      height: application.stage.height,
    });
  });
});

describe('trimStage', () => {
  it('resizes the renderer to the sprite size', () => {
    const application = makeApplication();
    const sprite = makeSprite(320, 240);

    trimStage(application, sprite);

    expect(application.renderer.resize).toHaveBeenCalledWith(320, 240);
  });
});

describe('resizeStage', () => {
  it('centers the sprite and resizes the stage', () => {
    const application = makeApplication();
    const sprite = makeSprite();

    resizeStage({ application, sprite, newWidth: 400, newHeight: 200 });

    expect([sprite.anchor.x, sprite.anchor.y]).toEqual([0.5, 0.5]);
    expect([sprite.position.x, sprite.position.y]).toEqual([200, 100]);
    expect(application.renderer.resize).toHaveBeenCalledWith(400, 200);
  });
});

describe('saveAsBlob', () => {
  it('resolves with the JPEG blob produced by the canvas', async () => {
    const blob = new Blob(['jpeg'], { type: 'image/jpeg' });
    const toBlobSpy = vi.fn((callback: (value: Blob | null) => void) =>
      callback(blob),
    );
    const application = makeApplication({ toBlob: toBlobSpy });

    await expect(saveAsBlob(application)).resolves.toBe(blob);
    expect(toBlobSpy).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.5,
    );
  });

  it('rejects when the canvas produces no blob', async () => {
    const application = makeApplication({
      toBlob: (callback: (value: Blob | null) => void) => callback(null),
    });

    await expect(saveAsBlob(application)).rejects.toBe('EXTRACT_FAILED');
  });

  it('rejects when the canvas cannot export at all', async () => {
    const application = makeApplication({ toBlob: undefined });

    await expect(saveAsBlob(application)).rejects.toBe('EXTRACT_FAILED');
  });
});

describe('saveAsDataURL', () => {
  it('returns the data URL of the canvas', () => {
    const application = makeApplication({
      toDataURL: () => 'data:image/png;base64,AAA',
    });

    expect(saveAsDataURL(application)).toBe('data:image/png;base64,AAA');
  });

  it('returns undefined when the canvas cannot export', () => {
    const application = makeApplication({ toDataURL: undefined });

    expect(saveAsDataURL(application)).toBeUndefined();
  });
});

describe('toBlob', () => {
  it('resolves with a lossless PNG blob', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const toBlobSpy = vi.fn((callback: (value: Blob | null) => void) =>
      callback(blob),
    );
    const application = makeApplication({ toBlob: toBlobSpy });

    await expect(toBlob(application)).resolves.toBe(blob);
    expect(toBlobSpy).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      1,
    );
  });

  it('rejects when the canvas produces no blob', async () => {
    const application = makeApplication({
      toBlob: (callback: (value: Blob | null) => void) => callback(null),
    });

    await expect(toBlob(application)).rejects.toBe('EXTRACT_FAIL');
  });
});

describe('getApplicationScale', () => {
  it('is the ratio between the displayed width and the canvas width', () => {
    const application = makeApplication({
      width: 400,
      getBoundingClientRect: () => ({ width: 200 }),
    });

    expect(getApplicationScale(application)).toBe(0.5);
  });

  it('falls back to 1 when the canvas cannot be measured', () => {
    const application = makeApplication({ getBoundingClientRect: undefined });

    expect(getApplicationScale(application)).toBe(1);
  });
});

describe('autoResize', () => {
  it('fits the canvas to its parent width', () => {
    const application = makeApplication({
      parentNode: { offsetWidth: 300 },
      style: {},
    });

    autoResize(application, makeSprite(1000, 500));

    expect(application.canvas.style.width).toBe('300px');
    expect(application.canvas.style.height).toBe('150px');
  });

  it('never goes below the minimum width, even without a parent', () => {
    const application = makeApplication({ parentNode: null, style: {} });

    autoResize(application, makeSprite(10, 10));

    expect(application.canvas.style.width).toBe('100px');
  });

  it('does nothing when the canvas has no style', () => {
    const application = makeApplication({ style: undefined });

    expect(() => autoResize(application, makeSprite())).not.toThrow();
  });
});

describe('updateImage', () => {
  const settings = (rotation: number): ImageSettings => ({
    stage: { size: { width: 640, height: 480 }, scale: { x: 1, y: 1 } },
    sprite: {
      rotation,
      size: { width: 300, height: 150 },
      scale: { x: 1, y: 1 },
      position: { x: 5, y: 6 },
      anchor: { x: 0.5, y: 0.5 },
    },
  });

  it('adds the sprite to the stage and sizes the renderer after it', async () => {
    const application = makeApplication();
    const sprite = makeSprite(320, 240);

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: sprite,
    });

    expect(application.stage.getChildByLabel(DEFAULT_SPRITE_NAME, true)).toBe(
      sprite,
    );
    expect(application.renderer.resize).toHaveBeenCalledWith(320, 240);
  });

  it('drops the previous sprite and any leftover blur layer', async () => {
    const application = makeApplication();
    const previous = makeSprite();
    const blurLayer = new PIXI.Container();
    blurLayer.label = BLUR_LAYER_NAME;
    application.stage.addChild(previous, blurLayer);

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: makeSprite(),
    });

    expect(application.stage.children).not.toContain(previous);
    expect(application.stage.getChildByLabel(BLUR_LAYER_NAME)).toBeNull();
  });

  it('restores the geometry carried by the settings', async () => {
    const application = makeApplication();
    const sprite = makeSprite();

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: sprite,
      settings: settings(0),
    });

    expect([sprite.position.x, sprite.position.y]).toEqual([5, 6]);
    expect([sprite.anchor.x, sprite.anchor.y]).toEqual([0.5, 0.5]);
    expect([sprite.width, sprite.height]).toEqual([300, 150]);
    expect(application.renderer.resize).toHaveBeenCalledWith(640, 480);
  });

  it('swaps width and height for a sprite rotated a quarter turn', async () => {
    const application = makeApplication();
    const sprite = makeSprite();

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: sprite,
      settings: settings(Math.PI / 2),
    });

    expect([sprite.width, sprite.height]).toEqual([150, 300]);
  });

  it('keeps the dimensions for a sprite rotated a half turn', async () => {
    const application = makeApplication();
    const sprite = makeSprite();

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: sprite,
      settings: settings(Math.PI),
    });

    expect([sprite.width, sprite.height]).toEqual([300, 150]);
  });

  it('accepts an image element as datasource', async () => {
    const application = makeApplication();
    const image = document.createElement('img');

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: image,
    });

    expect(
      application.stage.getChildByLabel(DEFAULT_SPRITE_NAME, true),
    ).not.toBeNull();
  });

  it('does nothing without an application', async () => {
    await expect(
      updateImage(undefined as unknown as PIXI.Application, {
        spriteName: DEFAULT_SPRITE_NAME,
        imgDatasource: makeSprite(),
      }),
    ).resolves.toBeUndefined();
  });

  it('does nothing when the application has no stage', async () => {
    const application = { stage: null } as unknown as PIXI.Application;

    await expect(
      updateImage(application, {
        spriteName: DEFAULT_SPRITE_NAME,
        imgDatasource: makeSprite(),
      }),
    ).resolves.toBeUndefined();
  });
});

describe('updateImage from a URL', () => {
  /**
   * The module builds its own `Image`, so the global constructor is stubbed to
   * return a real `<img>` whose loading outcome is scripted — jsdom never
   * fetches anything.
   */
  function stubImage(mode: 'complete' | 'load' | 'error') {
    vi.stubGlobal('Image', function FakeImage() {
      const image = document.createElement('img');

      if (mode === 'complete') {
        Object.defineProperty(image, 'complete', { get: () => true });
      } else {
        queueMicrotask(() =>
          mode === 'load'
            ? image.onload?.(new Event('load') as never)
            : image.onerror?.(new Event('error') as never),
        );
      }

      return image;
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses an image already in cache without waiting', async () => {
    stubImage('complete');
    const application = makeApplication();

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: '/workspace/document/image-id',
    });

    expect(
      application.stage.getChildByLabel(DEFAULT_SPRITE_NAME, true),
    ).not.toBeNull();
  });

  it('waits for the image to load', async () => {
    stubImage('load');
    const application = makeApplication();

    await updateImage(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: '/workspace/document/image-id',
    });

    expect(
      application.stage.getChildByLabel(DEFAULT_SPRITE_NAME, true),
    ).not.toBeNull();
  });

  it('rejects when the image fails to load', async () => {
    stubImage('error');
    const application = makeApplication();

    await expect(
      updateImage(application, {
        spriteName: DEFAULT_SPRITE_NAME,
        imgDatasource: '/workspace/document/missing',
      }),
    ).rejects.toBeDefined();
  });
});

describe('updateImageFromBlob', () => {
  function stubBlobPipeline(mode: 'load' | 'error') {
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:image'),
      revokeObjectURL,
    });
    vi.stubGlobal('Image', function FakeImage() {
      const image = document.createElement('img');
      queueMicrotask(() =>
        mode === 'load'
          ? image.onload?.(new Event('load') as never)
          : image.onerror?.(new Event('error') as never),
      );
      return image;
    });

    return { revokeObjectURL };
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves with the sprite added to the stage and releases the object URL', async () => {
    const { revokeObjectURL } = stubBlobPipeline('load');
    const application = makeApplication();

    const sprite = await updateImageFromBlob(application, {
      spriteName: DEFAULT_SPRITE_NAME,
      imgDatasource: new Blob(['png'], { type: 'image/png' }),
    });

    expect(sprite).toBe(
      application.stage.getChildByLabel(DEFAULT_SPRITE_NAME, true),
    );
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:image');
  });

  it('rejects and releases the object URL when the blob cannot be decoded', async () => {
    const { revokeObjectURL } = stubBlobPipeline('error');
    const application = makeApplication();

    await expect(
      updateImageFromBlob(application, {
        spriteName: DEFAULT_SPRITE_NAME,
        imgDatasource: new Blob(['nope']),
      }),
    ).rejects.toThrow('Failed to load image from Blob');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:image');
  });
});
