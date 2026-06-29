import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserSchools } from './useUserSchools';

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  useWidget: vi.fn(),
  savePreference: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  WIDGET_NAME: { SCHOOL: 'school-widget' },
}));

vi.mock('src/hooks/useSession', () => ({
  useSession: mocks.useSession,
}));

vi.mock('../../hooks/useWidget', () => ({
  default: mocks.useWidget,
}));

describe('useUserSchools', () => {
  const schools = [
    { id: 's1', name: 'School 1' },
    { id: 's2', name: 'School 2' },
  ] as any[];

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useSession.mockReturnValue({
      data: { userDescription: { schools } },
    });

    mocks.useWidget.mockReturnValue({
      preference: undefined,
      savePreference: mocks.savePreference,
    });
  });

  it('returns empty schools when user has no schools', () => {
    mocks.useSession.mockReturnValue({
      data: { userDescription: { schools: null } },
    });

    const { result } = renderHook(() => useUserSchools());

    expect(result.current.schools).toEqual([]);
    expect(result.current.selectedSchool).toBeUndefined();
  });

  it('selects preferred school when preference exists', async () => {
    mocks.useWidget.mockReturnValue({
      preference: { schoolId: 's2' },
      savePreference: mocks.savePreference,
    });

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s2');
    });
  });

  it('falls back to first school when preferred school is missing', async () => {
    mocks.useWidget.mockReturnValue({
      preference: { schoolId: 'missing-school' },
      savePreference: mocks.savePreference,
    });

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s1');
    });
  });

  it('selects the first school by default when no preference exists', async () => {
    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s1');
    });
  });

  it('updates selected school and saves preference on change when preference exists', async () => {
    mocks.useWidget.mockReturnValue({
      preference: { schoolId: 's1' },
      savePreference: mocks.savePreference,
    });

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s1');
    });

    act(() => {
      result.current.handleSelectedSchoolChange(schools[1]);
    });

    expect(result.current.selectedSchool?.id).toBe('s2');
    expect(mocks.savePreference).toHaveBeenCalledWith({ schoolId: 's2' });
  });

  it('updates selected school but does not save when no preference exists', () => {
    const { result } = renderHook(() => useUserSchools());

    act(() => {
      result.current.handleSelectedSchoolChange(schools[0]);
    });

    expect(result.current.selectedSchool?.id).toBe('s1');
    expect(mocks.savePreference).not.toHaveBeenCalled();
  });
});
