import { renderHook } from '~/setup';
import { useSubjectsOptions } from './useSubjectsOptions';

describe('useSubjectsOptions', () => {
  it('returns the fixed list of subject area options', () => {
    const { result } = renderHook(() => useSubjectsOptions());

    expect(result.current).toHaveLength(36);
    expect(result.current[0].value).toBe('bpr.subjectArea.artActivity');
    expect(result.current[result.current.length - 1].value).toBe('bpr.other');
  });

  it('provides a truthy translated label for every option', () => {
    const { result } = renderHook(() => useSubjectsOptions());

    result.current.forEach((option) => {
      expect(typeof option.label).toBe('string');
      expect(option.label).toBeTruthy();
    });
  });
});
