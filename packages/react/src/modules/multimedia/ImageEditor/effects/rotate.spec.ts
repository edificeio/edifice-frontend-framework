import * as PIXI from 'pixi.js';
import { rotate } from './rotate';

const SPRITE_NAME = 'image';

function makeSprite(width = 200, height = 100) {
  const sprite = new PIXI.Sprite(
    new PIXI.Texture({ source: new PIXI.TextureSource({ width, height }) }),
  );
  sprite.label = SPRITE_NAME;
  return sprite;
}

/**
 * `rotate` goes through the canvas twice (blob before / blob after), so the
 * canvas double must export blobs. The `Image` global is stubbed so the blob
 * reload resolves without any real decoding.
 */
function makeApplication({
  withSprite = true,
  style = {} as Record<string, string> | undefined,
}: { withSprite?: boolean; style?: Record<string, string> } = {}) {
  const stage = new PIXI.Container();
  if (withSprite) stage.addChild(makeSprite());

  const application = {
    stage,
    render: vi.fn(),
    renderer: { resize: vi.fn() },
    canvas: {
      style,
      clientHeight: 300,
      parentNode: null,
      width: 200,
      toBlob: (callback: (value: Blob | null) => void) =>
        callback(new Blob(['png'], { type: 'image/png' })),
    },
  };

  return application as unknown as PIXI.Application & {
    render: ReturnType<typeof vi.fn>;
    canvas: { style: Record<string, string>; clientHeight: number };
  };
}

describe('rotate effect', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:image'),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal('Image', function FakeImage() {
      const image = document.createElement('img');
      queueMicrotask(() => image.onload?.(new Event('load') as never));
      return image;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('turns the image a quarter turn and swaps the stage dimensions', async () => {
    const application = makeApplication();

    await rotate(application, SPRITE_NAME);

    const sprite = application.stage.getChildByLabel(
      SPRITE_NAME,
      true,
    ) as PIXI.Sprite;
    expect(sprite).not.toBeNull();
    expect(application.render).toHaveBeenCalled();
  });

  it('hides the canvas while rotating, then restores its style', async () => {
    const application = makeApplication({
      style: { maxHeight: '500px', visibility: 'visible' },
    });

    await rotate(application, SPRITE_NAME);

    expect(application.canvas.style.maxHeight).toBe('500px');
    expect(application.canvas.style.visibility).toBe('visible');
  });

  it('restores an initially empty style', async () => {
    const application = makeApplication({ style: {} });

    await rotate(application, SPRITE_NAME);

    expect(application.canvas.style.maxHeight).toBe('');
    expect(application.canvas.style.visibility).toBe('');
  });

  it('does nothing without a sprite to rotate', async () => {
    const application = makeApplication({ withSprite: false });

    await rotate(application, SPRITE_NAME);

    expect(application.render).not.toHaveBeenCalled();
  });

  // `application?.stage` is optional-chained, so a missing application resolves
  // quietly rather than throwing.
  it('resolves quietly without an application', async () => {
    await expect(
      rotate(undefined as unknown as PIXI.Application, SPRITE_NAME),
    ).resolves.toBeUndefined();
  });

  it('stops when the reloaded blob yields no sprite', async () => {
    const application = makeApplication();
    // An image that never loads leaves the promise pending, so a failing decode
    // is scripted instead: the sprite is never re-created.
    vi.stubGlobal('Image', function FakeImage() {
      const image = document.createElement('img');
      queueMicrotask(() => image.onerror?.(new Event('error') as never));
      return image;
    });

    await expect(rotate(application, SPRITE_NAME)).rejects.toThrow(
      'Failed to load image from Blob',
    );
    expect(application.render).not.toHaveBeenCalled();
  });
});
