// packages/react/src/modules/homepage/components/SchoolWidget/useUserSchools.test.tsx
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserSchools } from './useUserSchools';

const mocks = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
  useWidgetPreferences: vi.fn(),
  lookup: vi.fn(),
  saveUserPreferences: vi.fn(),
}));

vi.mock('src/providers', () => ({
  useEdificeClient: mocks.useEdificeClient,
}));

vi.mock('../../hooks/useWidgetPreferences', () => ({
  default: mocks.useWidgetPreferences,
}));

vi.mock('@edifice.io/client', () => ({
  WIDGET_NAME: { SCHOOL: 'SCHOOL' },
}));

describe('useUserSchools', () => {
  const schools = [
    { id: 's1', name: 'School 1' },
    { id: 's2', name: 'School 2' },
  ] as any[];

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useEdificeClient.mockReturnValue({
      userDescription: { schools },
    });

    mocks.lookup.mockReturnValue(undefined);

    mocks.useWidgetPreferences.mockReturnValue({
      lookup: mocks.lookup,
      saveUserPreferences: mocks.saveUserPreferences,
    });
  });

  it('returns empty schools when user has no schools', () => {
    mocks.useEdificeClient.mockReturnValue({
      userDescription: { schools: null },
    });

    const { result } = renderHook(() => useUserSchools());

    expect(result.current.schools).toEqual([]);
    expect(result.current.selectedSchool).toBeUndefined();
  });

  it('selects preferred school when preference exists', async () => {
    const userPref = { schoolId: 's2' };
    mocks.lookup.mockReturnValue({ userPref });

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s2');
    });

    expect(mocks.lookup).toHaveBeenCalledWith('SCHOOL');
  });

  it('falls back to first school when preferred school is missing', async () => {
    const userPref = { schoolId: 'missing-school' };
    mocks.lookup.mockReturnValue({ userPref });

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s1');
    });
  });

  it('keeps selectedSchool undefined when no user preference exists', async () => {
    mocks.lookup.mockReturnValue(undefined);

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool).toBeUndefined();
    });
  });

  it('updates selected school and saves preference on change when userPref exists', async () => {
    const userPref = { schoolId: 's1' };
    mocks.lookup.mockReturnValue({ userPref });

    const { result } = renderHook(() => useUserSchools());

    await waitFor(() => {
      expect(result.current.selectedSchool?.id).toBe('s1');
    });

    act(() => {
      result.current.handleSelectedSchoolChange(schools[1] as any);
    });

    expect(result.current.selectedSchool?.id).toBe('s2');
    expect(userPref.schoolId).toBe('s2');
    expect(mocks.saveUserPreferences).toHaveBeenCalledTimes(1);
  });

  it('updates selected school but does not save when no userPref exists', () => {
    mocks.lookup.mockReturnValue(undefined);

    const { result } = renderHook(() => useUserSchools());

    act(() => {
      result.current.handleSelectedSchoolChange(schools[0] as any);
    });

    expect(result.current.selectedSchool?.id).toBe('s1');
    expect(mocks.saveUserPreferences).not.toHaveBeenCalled();
  });
});
