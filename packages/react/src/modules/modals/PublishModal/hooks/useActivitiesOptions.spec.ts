import { renderHook } from '~/setup';
import { useActivitiesOptions } from './useActivitiesOptions';

describe('useActivitiesOptions', () => {
  it('returns the fixed list of activity type options', () => {
    const { result } = renderHook(() => useActivitiesOptions());

    expect(result.current).toHaveLength(8);
    expect(result.current[0].value).toBe('bpr.activityType.classroomActivity');
    expect(result.current[result.current.length - 1].value).toBe('bpr.other');
  });

  it('provides a truthy translated label for every option', () => {
    const { result } = renderHook(() => useActivitiesOptions());

    result.current.forEach((option) => {
      expect(typeof option.label).toBe('string');
      expect(option.label).toBeTruthy();
    });
  });
});
