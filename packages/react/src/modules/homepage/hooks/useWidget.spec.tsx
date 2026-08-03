import {
  IWidget,
  IWidgetPreferences,
  WIDGET_POSITION,
} from '@edifice.io/client';
import { renderHook, waitFor } from '~/setup';
import useWidget from './useWidget';

const { useWidgetPreferences } = vi.hoisted(() => ({
  useWidgetPreferences: vi.fn(),
}));

vi.mock('./useWidgetPreferences', () => ({ useWidgetPreferences }));

function widget(partial: Partial<IWidget> & { name: string }): IWidget {
  return { mandatory: false, ...partial } as unknown as IWidget;
}

function setup(
  options: {
    widgets?: IWidget[];
    preferences?: IWidgetPreferences;
  } = {},
) {
  // An explicit `widgets: undefined` must survive, so no default parameter here.
  const widgets =
    'widgets' in options ? options.widgets : [widget({ name: 'my-apps' })];
  const savePreferences = vi.fn();

  useWidgetPreferences.mockReturnValue({
    widgets,
    preferences: options.preferences,
    savePreferences,
  });

  return { savePreferences };
}

describe('useWidget', () => {
  it('exposes the widget matching the requested name', async () => {
    setup({
      widgets: [widget({ name: 'my-apps' }), widget({ name: 'notes' })],
    });

    const { result } = renderHook(() => useWidget('notes'));

    await waitFor(() => expect(result.current.widget?.name).toBe('notes'));
  });

  it('exposes no widget when the name is unknown to the platform', async () => {
    setup();

    const { result } = renderHook(() => useWidget('notes'));

    await waitFor(() => expect(result.current.preference).toBeDefined());
    expect(result.current.widget).toBeUndefined();
  });

  it('handles an unloaded widget list', async () => {
    setup({ widgets: undefined });

    const { result } = renderHook(() => useWidget('my-apps'));

    await waitFor(() => expect(result.current.preference).toBeDefined());
    expect(result.current.widget).toBeUndefined();
  });

  describe('default preferences', () => {
    it('falls back to the built-in index and position of the widget', async () => {
      setup();

      const { result } = renderHook(() => useWidget('my-apps'));

      await waitFor(() =>
        expect(result.current.preference).toEqual({
          index: 10,
          show: true,
          position: WIDGET_POSITION.RIGHT,
        }),
      );
    });

    it('places a widget it does not know at the very end', async () => {
      setup({ widgets: [] });

      const { result } = renderHook(() =>
        useWidget('unknown-widget' as 'notes'),
      );

      await waitFor(() =>
        expect(result.current.preference).toEqual({
          index: 999,
          show: true,
          position: undefined,
        }),
      );
    });

    it('honors the stored preference over the default', async () => {
      setup({
        preferences: {
          'my-apps': { index: 3, show: false, position: WIDGET_POSITION.LEFT },
        } as unknown as IWidgetPreferences,
      });

      const { result } = renderHook(() => useWidget('my-apps'));

      await waitFor(() =>
        expect(result.current.preference).toEqual({
          index: 3,
          show: false,
          position: WIDGET_POSITION.LEFT,
        }),
      );
    });
  });

  describe('mandatory widgets', () => {
    it('forces a mandatory widget to be shown at its default index', async () => {
      setup({
        widgets: [widget({ name: 'my-apps', mandatory: true })],
        preferences: {
          'my-apps': { index: 42, show: false, position: WIDGET_POSITION.LEFT },
        } as unknown as IWidgetPreferences,
      });

      const { result } = renderHook(() => useWidget('my-apps'));

      await waitFor(() =>
        expect(result.current.preference).toMatchObject({
          index: 10,
          show: true,
        }),
      );
    });

    it('puts a mandatory unknown widget first', async () => {
      setup({
        widgets: [widget({ name: 'unknown-widget', mandatory: true })],
      });

      const { result } = renderHook(() =>
        useWidget('unknown-widget' as 'notes'),
      );

      await waitFor(() =>
        expect(result.current.preference).toMatchObject({
          index: 0,
          show: true,
        }),
      );
    });
  });

  describe('savePreference', () => {
    it('writes the widget preference into the whole preferences payload', async () => {
      const preferences = {
        notes: { index: 1, show: true, position: WIDGET_POSITION.RIGHT },
      } as unknown as IWidgetPreferences;
      const { savePreferences } = setup({ preferences });

      const { result } = renderHook(() => useWidget('my-apps'));
      await waitFor(() => expect(result.current.preference).toBeDefined());

      result.current.savePreference({
        index: 5,
        show: false,
        position: WIDGET_POSITION.LEFT,
      });

      expect(savePreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          'my-apps': {
            index: 5,
            show: false,
            position: WIDGET_POSITION.LEFT,
          },
        }),
      );
    });

    it('saves nothing while the preferences are not loaded', async () => {
      const { savePreferences } = setup();

      const { result } = renderHook(() => useWidget('my-apps'));
      await waitFor(() => expect(result.current.preference).toBeDefined());

      expect(
        result.current.savePreference({ index: 5, show: true }),
      ).toBeUndefined();
      expect(savePreferences).not.toHaveBeenCalled();
    });
  });
});
