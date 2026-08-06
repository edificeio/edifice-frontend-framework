import { renderHook } from '~/setup';
import { useLanguageOptions } from './useLanguageOptions';

describe('useLanguageOptions', () => {
  it('returns the fixed list of language options', () => {
    const { result } = renderHook(() => useLanguageOptions());

    expect(result.current).toHaveLength(11);
    expect(result.current[0].value).toBe('de_DE');
    expect(result.current[result.current.length - 1].value).toBe('bpr.other');
  });

  it('provides a truthy translated label for every option', () => {
    const { result } = renderHook(() => useLanguageOptions());

    result.current.forEach((option) => {
      expect(typeof option.label).toBe('string');
      expect(option.label).toBeTruthy();
    });
  });
});
