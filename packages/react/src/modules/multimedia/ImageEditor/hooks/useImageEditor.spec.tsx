import * as PIXI from 'pixi.js';

import { act, renderHook, waitFor } from '~/setup';

import useImageEditor from './useImageEditor';

import * as cropEffect from '../effects/crop';
import * as misc from '../effects/misc';

vi.mock('../effects/blur', () => ({ start: vi.fn(), stop: vi.fn() }));
vi.mock('../effects/crop', () => ({
  start: vi.fn(),
  stop: vi.fn(),
  save: vi.fn(),
}));
vi.mock('../effects/resize', () => ({
  start: vi.fn(),
  stop: vi.fn(),
  save: vi.fn(),
}));
vi.mock('../effects/rotate', () => ({ rotate: vi.fn() }));

// Only the canvas-bound helpers are doubled — DEFAULT_SPRITE_NAME and the
// settings builders stay real, the hook relies on them for its defaults.
vi.mock('../effects/misc', async (importOriginal) => ({
  ...(await importOriginal<typeof misc>()),
  updateImage: vi.fn(() => Promise.resolve()),
  updateImageFromBlob: vi.fn(),
  autoResize: vi.fn(),
  saveAsBlob: vi.fn(() => Promise.resolve(new Blob(['jpeg']))),
  saveAsDataURL: vi.fn(() => 'data:image/jpeg;base64,AAA'),
  toBlob: vi.fn(() => Promise.resolve(new Blob(['png']))),
}));

const IMAGE_SRC = '/workspace/document/first';

function makeApplication() {
  const stage = new PIXI.Container();
  const sprite = new PIXI.Sprite(
    new PIXI.Texture({
      source: new PIXI.TextureSource({ width: 200, height: 100 }),
    }),
  );
  sprite.label = misc.DEFAULT_SPRITE_NAME;
  stage.addChild(sprite);

  return { stage, canvas: {} } as unknown as PIXI.Application;
}

/** Mounts the hook, then hands it a PIXI application as <ImageEditor> would. */
async function setupWithApplication(imageSrc = IMAGE_SRC) {
  const application = makeApplication();
  const view = renderHook(
    ({ src }: { src: string }) => useImageEditor({ imageSrc: src }),
    { initialProps: { src: imageSrc } },
  );

  await act(async () => {
    view.result.current.setApplication(application);
  });
  await waitFor(() => expect(view.result.current.loading).toBe(false));

  return { ...view, application };
}

describe('useImageEditor', () => {
  describe('loading the image', () => {
    it('stays loading as long as no application is attached', () => {
      const { result } = renderHook(() =>
        useImageEditor({ imageSrc: IMAGE_SRC }),
      );

      expect(result.current.loading).toBe(true);
      expect(misc.updateImage).not.toHaveBeenCalled();
    });

    it('draws the image once the application is attached', async () => {
      await setupWithApplication();

      expect(misc.updateImage).toHaveBeenCalledWith(expect.anything(), {
        spriteName: misc.DEFAULT_SPRITE_NAME,
        imgDatasource: IMAGE_SRC,
      });
    });

    it('redraws when the source changes', async () => {
      const { rerender } = await setupWithApplication();
      vi.mocked(misc.updateImage).mockClear();

      await act(async () => {
        rerender({ src: '/workspace/document/second' });
      });

      expect(misc.updateImage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          imgDatasource: '/workspace/document/second',
        }),
      );
    });

    it('honors a custom sprite name', async () => {
      const application = makeApplication();
      const { result } = renderHook(() =>
        useImageEditor({ imageSrc: IMAGE_SRC, spriteName: 'custom' }),
      );

      await act(async () => {
        result.current.setApplication(application);
      });

      expect(misc.updateImage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ spriteName: 'custom' }),
      );
    });
  });

  describe('exports', () => {
    it('returns nothing without an application', async () => {
      const { result } = renderHook(() =>
        useImageEditor({ imageSrc: IMAGE_SRC }),
      );

      await expect(result.current.toBlob()).resolves.toBeUndefined();
      expect(result.current.toDataURL()).toBeUndefined();
      expect(misc.saveAsBlob).not.toHaveBeenCalled();
      expect(misc.saveAsDataURL).not.toHaveBeenCalled();
    });

    it('exports the canvas as a blob', async () => {
      const { result } = await setupWithApplication();

      await expect(result.current.toBlob()).resolves.toBeInstanceOf(Blob);
      expect(misc.saveAsBlob).toHaveBeenCalled();
    });

    it('exports the canvas as a data URL', async () => {
      const { result } = await setupWithApplication();

      expect(result.current.toDataURL()).toBe('data:image/jpeg;base64,AAA');
    });
  });

  describe('actions', () => {
    it.each(['startCrop', 'startBlur', 'startResize', 'rotate'] as const)(
      'historizes %s and clears the loading flag afterwards',
      async (action) => {
        const { result } = await setupWithApplication();

        await act(async () => {
          await result.current[action]();
        });

        expect(result.current.historyCount).toBe(1);
        expect(result.current.loading).toBe(false);
      },
    );

    it('starts the crop effect through the history', async () => {
      const { result } = await setupWithApplication();

      await act(async () => {
        await result.current.startCrop();
      });

      expect(cropEffect.start).toHaveBeenCalled();
    });

    it('redraws the image with the cropped sprite on save', async () => {
      const cropped = new PIXI.Sprite();
      vi.mocked(cropEffect.save).mockReturnValue(cropped);
      const { result } = await setupWithApplication();
      vi.mocked(misc.updateImage).mockClear();

      act(() => {
        result.current.stopCrop(true);
      });

      expect(misc.updateImage).toHaveBeenCalledWith(expect.anything(), {
        imgDatasource: cropped,
        spriteName: misc.DEFAULT_SPRITE_NAME,
      });
    });
  });

  describe('restoring', () => {
    it('replays the last backup on the canvas', async () => {
      const { result } = await setupWithApplication();

      await act(async () => {
        await result.current.startCrop();
      });
      await act(async () => {
        await result.current.restore();
      });

      expect(misc.updateImageFromBlob).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          spriteName: misc.DEFAULT_SPRITE_NAME,
          imgDatasource: expect.any(Blob),
        }),
      );
      expect(result.current.historyCount).toBe(0);
    });
  });

  describe('window resize', () => {
    it('refits the sprite when the window is resized', async () => {
      await setupWithApplication();

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(misc.autoResize).toHaveBeenCalled();
    });

    it('does nothing when the edited sprite is gone', async () => {
      const { application } = await setupWithApplication();
      application.stage.removeChildren();

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(misc.autoResize).not.toHaveBeenCalled();
    });

    it('stops listening once unmounted', async () => {
      const { unmount } = await setupWithApplication();

      unmount();
      window.dispatchEvent(new Event('resize'));

      expect(misc.autoResize).not.toHaveBeenCalled();
    });
  });
});
