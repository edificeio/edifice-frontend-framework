import * as PIXI from 'pixi.js';

import useImageEffects from './useImageEffects';

import * as blurEffect from '../effects/blur';
import * as cropEffect from '../effects/crop';
import * as resizeEffect from '../effects/resize';
import * as rotateEffect from '../effects/rotate';

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

const SPRITE_NAME = 'image';

/**
 * `useImageEffects` calls no React hook: it is a plain factory of callbacks,
 * so it can be invoked directly, without `renderHook`.
 */
function setup(options: { application?: PIXI.Application } = {}) {
  const onSave = vi.fn();
  // `'application' in options` and not a default parameter: the tests need to
  // pass an explicit `undefined`, which a default would silently replace.
  const application =
    'application' in options ? options.application : ({} as PIXI.Application);
  // Despite its name, useImageEffects calls no React hook, so invoking it
  // outside a component is safe — the lint rule only goes by the name.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const effects = useImageEffects({
    application,
    spriteName: SPRITE_NAME,
    onSave,
  });
  return { ...effects, onSave };
}

const aSprite = () => ({ label: SPRITE_NAME }) as unknown as PIXI.Sprite;

describe('useImageEffects', () => {
  describe('delegation to the effects', () => {
    it('starts the crop on the named sprite', () => {
      setup().startCrop();

      expect(cropEffect.start).toHaveBeenCalledWith(expect.anything(), {
        spriteName: SPRITE_NAME,
      });
    });

    it('starts the blur on the named sprite', () => {
      setup().startBlur();

      expect(blurEffect.start).toHaveBeenCalledWith(expect.anything(), {
        spriteName: SPRITE_NAME,
      });
    });

    it('starts the resize with the sprite name as a positional argument', () => {
      setup().startResize();

      expect(resizeEffect.start).toHaveBeenCalledWith(
        expect.anything(),
        SPRITE_NAME,
      );
    });

    it('awaits the rotation, which is the only asynchronous effect', async () => {
      await setup().rotate();

      expect(rotateEffect.rotate).toHaveBeenCalledWith(
        expect.anything(),
        SPRITE_NAME,
      );
    });

    it('stops the blur without asking anything to be saved', () => {
      setup().stopBlur();

      expect(blurEffect.stop).toHaveBeenCalled();
    });
  });

  describe('without an application', () => {
    // Every callback guards on the application, which is undefined until the
    // <ImageEditor> mounts the PIXI canvas.
    it('does nothing at all', async () => {
      const effects = setup({ application: undefined });

      effects.startCrop();
      effects.stopCrop(true);
      effects.startBlur();
      effects.stopBlur();
      effects.startResize();
      effects.stopResize(true);
      await effects.rotate();

      expect(cropEffect.start).not.toHaveBeenCalled();
      expect(cropEffect.stop).not.toHaveBeenCalled();
      expect(cropEffect.save).not.toHaveBeenCalled();
      expect(blurEffect.start).not.toHaveBeenCalled();
      expect(blurEffect.stop).not.toHaveBeenCalled();
      expect(resizeEffect.start).not.toHaveBeenCalled();
      expect(resizeEffect.stop).not.toHaveBeenCalled();
      expect(resizeEffect.save).not.toHaveBeenCalled();
      expect(rotateEffect.rotate).not.toHaveBeenCalled();
      expect(effects.onSave).not.toHaveBeenCalled();
    });
  });

  describe('stopCrop', () => {
    it('reports the cropped sprite and leaves the cleanup to save()', () => {
      const sprite = aSprite();
      vi.mocked(cropEffect.save).mockReturnValue(sprite);
      const { stopCrop, onSave } = setup();

      stopCrop(true);

      expect(onSave).toHaveBeenCalledWith(sprite);
      // save() already removed the crop controls, calling stop() again would
      // be a double cleanup.
      expect(cropEffect.stop).not.toHaveBeenCalled();
    });

    it('falls back to a plain stop when the crop produced nothing', () => {
      vi.mocked(cropEffect.save).mockReturnValue(undefined);
      const { stopCrop, onSave } = setup();

      stopCrop(true);

      expect(onSave).not.toHaveBeenCalled();
      expect(cropEffect.stop).toHaveBeenCalled();
    });

    it('discards the crop when asked not to save', () => {
      const { stopCrop, onSave } = setup();

      stopCrop(false);

      expect(cropEffect.save).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
      expect(cropEffect.stop).toHaveBeenCalled();
    });
  });

  describe('stopResize', () => {
    it('reports the resized sprite and still stops the effect', () => {
      const sprite = aSprite();
      vi.mocked(resizeEffect.save).mockReturnValue(sprite);
      const { stopResize, onSave } = setup();

      stopResize(true);

      expect(onSave).toHaveBeenCalledWith(sprite);
      // Unlike the crop, the resize cleanup is not done by save(): the hook
      // always calls stop() afterwards.
      expect(resizeEffect.stop).toHaveBeenCalled();
    });

    it('stops the effect when the resize produced nothing', () => {
      vi.mocked(resizeEffect.save).mockReturnValue(undefined);
      const { stopResize, onSave } = setup();

      stopResize(true);

      expect(onSave).not.toHaveBeenCalled();
      expect(resizeEffect.stop).toHaveBeenCalled();
    });

    it('discards the resize when asked not to save', () => {
      const { stopResize, onSave } = setup();

      stopResize(false);

      expect(resizeEffect.save).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
      expect(resizeEffect.stop).toHaveBeenCalled();
    });
  });
});
