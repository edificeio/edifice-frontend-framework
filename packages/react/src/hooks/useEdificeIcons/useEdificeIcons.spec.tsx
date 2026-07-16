import type { IWebApp, IWidget } from '@edifice.io/client';
import { renderHook } from '~/setup';
import useEdificeIcons from './useEdificeIcons';

describe('useEdificeIcons', () => {
  describe('getIconCode', () => {
    it('returns a string appCode unchanged', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getIconCode('blog')).toBe('blog');
    });

    it('normalizes an app icon (trim + lowercase) and strips the -large suffix', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(
        result.current.getIconCode({ icon: '  Blog-large  ' } as IWebApp),
      ).toBe('blog');
    });

    it('falls back to the placeholder when the app has no icon', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getIconCode({} as IWebApp)).toBe('placeholder');
    });

    it.each([
      ['messagerie', 'conversation'],
      ['formulaire', 'forms'],
      ['homeworks', 'cahier-de-texte'],
      ['news', 'actualites'],
    ])('maps the legacy label "%s" to "%s"', (input, expected) => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getIconCode(input)).toBe(expected);
    });
  });

  describe('class helpers', () => {
    it('builds the icon class', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getIconClass('blog')).toBe(
        'color-app-blog color-app app-blog',
      );
    });

    it('builds the background icon class', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getBackgroundIconClass('blog')).toBe(
        'bg-app-blog bg-app app-blog',
      );
    });

    it('builds the light background icon class', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getBackgroundLightIconClass('blog')).toBe(
        'bg-light-blog bg-app-light app-blog',
      );
    });

    it('builds the border icon class', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getBorderIconClass('blog')).toBe(
        'border-app-blog border-app app-blog',
      );
    });

    it('uses the placeholder appCode when the app resolves to an empty code', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.getIconClass('')).toBe(
        'color-app-placeholder color-app app-placeholder',
      );
    });
  });

  describe('isIconUrl', () => {
    it.each(['/img/icon.svg', 'http://host/icon.svg', 'https://host/icon.svg'])(
      'recognizes "%s" as a URL',
      (icon) => {
        const { result } = renderHook(() => useEdificeIcons());

        expect(result.current.isIconUrl(icon)).toBeTruthy();
      },
    );

    it('does not treat a plain icon code as a URL', () => {
      const { result } = renderHook(() => useEdificeIcons());

      expect(result.current.isIconUrl('blog')).toBeFalsy();
    });
  });

  describe('getWidgetIconClass', () => {
    it('maps a widget name to its icon', () => {
      const { result } = renderHook(() => useEdificeIcons());

      const widget = {
        platformConf: { name: 'calendar-widget' },
      } as unknown as IWidget;

      expect(result.current.getWidgetIconClass(widget)).toBe(
        'ic-widget-calendar',
      );
    });
  });
});
