import * as PIXI from 'pixi.js';

import { act, renderHook } from '~/setup';

import useHistoryTool, { UseHistoryToolsProps } from './useHistoryTool';

const SPRITE_NAME = 'image';

/**
 * Real PIXI display objects — only the canvas is a double. `misc.toBlob()`
 * resolves through `canvas.toBlob`, and `historize()` awaits that promise, so
 * the stub is what keeps the hook from hanging.
 */
function makeApplication({ withSprite = true }: { withSprite?: boolean } = {}) {
  const stage = new PIXI.Container();

  if (withSprite) {
    const sprite = new PIXI.Sprite(
      new PIXI.Texture({
        source: new PIXI.TextureSource({ width: 200, height: 100 }),
      }),
    );
    sprite.label = SPRITE_NAME;
    sprite.rotation = Math.PI / 2;
    sprite.position.set(10, 20);
    stage.addChild(sprite);
  }

  return {
    stage,
    canvas: {
      toBlob: (callback: (blob: Blob | null) => void) =>
        callback(new Blob(['image'], { type: 'image/png' })),
    },
  } as unknown as PIXI.Application;
}

function setup(props: Partial<UseHistoryToolsProps> = {}) {
  const onRestore = vi.fn();
  const application =
    'application' in props ? props.application : makeApplication();
  const view = renderHook(
    (overrides: Partial<UseHistoryToolsProps> = {}) =>
      useHistoryTool({
        application,
        spriteName: SPRITE_NAME,
        onRestore,
        ...props,
        ...overrides,
      }),
    { initialProps: {} },
  );
  return { ...view, onRestore, application };
}

describe('useHistoryTool', () => {
  it('starts with an empty history', () => {
    const { result } = setup();

    expect(result.current.historyCount).toBe(0);
  });

  describe('historize', () => {
    it('backs up the stage and runs the action', async () => {
      const { result } = setup();
      const action = vi.fn();

      await act(async () => {
        await result.current.historize(action);
      });

      expect(action).toHaveBeenCalledTimes(1);
      expect(result.current.historyCount).toBe(1);
    });

    it('forwards the value returned by the action', async () => {
      const { result } = setup();
      let returned: unknown;

      await act(async () => {
        returned = await result.current.historize(() => 'done');
      });

      expect(returned).toBe('done');
    });

    it('does nothing without an application', async () => {
      const { result } = setup({ application: undefined });
      const action = vi.fn();

      await act(async () => {
        await result.current.historize(action);
      });

      expect(action).not.toHaveBeenCalled();
      expect(result.current.historyCount).toBe(0);
    });

    it('does nothing when the edited sprite is missing from the stage', async () => {
      const { result } = setup({
        application: makeApplication({ withSprite: false }),
      });
      const action = vi.fn();

      await act(async () => {
        await result.current.historize(action);
      });

      expect(action).not.toHaveBeenCalled();
      expect(result.current.historyCount).toBe(0);
    });

    it('stacks one state per action', async () => {
      const { result } = setup();

      await act(async () => {
        await result.current.historize(vi.fn());
      });
      await act(async () => {
        await result.current.historize(vi.fn());
      });

      expect(result.current.historyCount).toBe(2);
    });

    it('drops the oldest state once the history is full', async () => {
      const { result } = setup({ maxSize: 2 });

      for (let i = 0; i < 4; i++) {
        await act(async () => {
          await result.current.historize(vi.fn());
        });
      }

      expect(result.current.historyCount).toBe(2);
    });

    it('empties the history when the application is replaced', async () => {
      const application = makeApplication();
      const { result, rerender } = setup({ application });

      await act(async () => {
        await result.current.historize(vi.fn());
      });
      expect(result.current.historyCount).toBe(1);

      rerender({ application: makeApplication() });

      expect(result.current.historyCount).toBe(0);
    });
  });

  describe('restore', () => {
    it('does nothing on an empty history', async () => {
      const { result, onRestore } = setup();

      await act(async () => {
        await result.current.restore();
      });

      expect(onRestore).not.toHaveBeenCalled();
    });

    it('replays the backup and pops it off the history', async () => {
      const { result, onRestore } = setup();

      await act(async () => {
        await result.current.historize(vi.fn());
      });
      await act(async () => {
        await result.current.restore();
      });

      expect(onRestore).toHaveBeenCalledTimes(1);
      expect(onRestore.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(result.current.historyCount).toBe(0);
    });

    it('hands over the geometry captured at backup time', async () => {
      const { result, onRestore } = setup();

      await act(async () => {
        await result.current.historize(vi.fn());
      });
      await act(async () => {
        await result.current.restore();
      });

      expect(onRestore.mock.calls[0][1]).toMatchObject({
        sprite: {
          rotation: Math.PI / 2,
          size: { width: 200, height: 100 },
          position: { x: 10, y: 20 },
          scale: { x: 1, y: 1 },
          anchor: { x: 0, y: 0 },
        },
        stage: { scale: { x: 1, y: 1 } },
      });
    });

    it('restores the most recent state first', async () => {
      const application = makeApplication();
      const { result, onRestore } = setup({ application });

      await act(async () => {
        await result.current.historize(vi.fn());
      });

      // Move the sprite so the second backup differs from the first one.
      const sprite = application.stage.getChildByLabel(
        SPRITE_NAME,
        true,
      ) as PIXI.Sprite;
      sprite.position.set(50, 60);

      await act(async () => {
        await result.current.historize(vi.fn());
      });
      await act(async () => {
        await result.current.restore();
      });

      expect(onRestore.mock.calls[0][1].sprite.position).toEqual({
        x: 50,
        y: 60,
      });
      expect(result.current.historyCount).toBe(1);
    });
  });
});
