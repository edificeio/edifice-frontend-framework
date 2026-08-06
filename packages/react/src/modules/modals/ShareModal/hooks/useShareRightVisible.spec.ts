import { ShareRight, ShareRightWithVisibles } from '@edifice.io/client';
import { renderHook } from '~/setup';
import { useShareRightVisible } from './useShareRightVisible';

// Minimal ShareRight fixture builder
const buildShareRight = (overrides: Partial<ShareRight> = {}): ShareRight => ({
  id: 'right-1',
  type: 'group',
  displayName: 'Right 1',
  avatarUrl: '',
  directoryUrl: '',
  actions: [],
  ...overrides,
});

// Minimal ShareRightWithVisibles fixture builder
const buildShareRights = (
  overrides: Partial<ShareRightWithVisibles> = {},
): ShareRightWithVisibles => ({
  rights: [],
  visibleUsers: [],
  visibleGroups: [],
  visibleBookmarks: [],
  ...overrides,
});

describe('useShareRightVisible', () => {
  it('returns true when shareRight type is not group', () => {
    const { result } = renderHook(() => useShareRightVisible());
    const shareRight = buildShareRight({ type: 'user' });
    const shareRights = buildShareRights();

    expect(result.current.isShareRightVisible(shareRight, shareRights)).toBe(
      true,
    );
  });

  it('returns true when the group is not found in visibleGroups', () => {
    const { result } = renderHook(() => useShareRightVisible());
    const shareRight = buildShareRight({ id: 'unknown-group' });
    const shareRights = buildShareRights({
      visibleGroups: [{ id: 'other-group', displayName: 'Other group' }],
    });

    expect(result.current.isShareRightVisible(shareRight, shareRights)).toBe(
      true,
    );
  });

  it('returns true when the group is found but labels are undefined', () => {
    const { result } = renderHook(() => useShareRightVisible());
    const shareRight = buildShareRight({ id: 'group-1' });
    const shareRights = buildShareRights({
      visibleGroups: [{ id: 'group-1', displayName: 'Group 1' }],
    });

    expect(result.current.isShareRightVisible(shareRight, shareRights)).toBe(
      true,
    );
  });

  it('returns true when the group is found but labels is not an array', () => {
    const { result } = renderHook(() => useShareRightVisible());
    const shareRight = buildShareRight({ id: 'group-1' });
    const shareRights = buildShareRights({
      visibleGroups: [
        {
          id: 'group-1',
          displayName: 'Group 1',
          labels: 'not-an-array' as unknown as string[],
        },
      ],
    });

    expect(result.current.isShareRightVisible(shareRight, shareRights)).toBe(
      true,
    );
  });

  it('returns false when the group labels include a hidden label', () => {
    const { result } = renderHook(() => useShareRightVisible());
    const shareRight = buildShareRight({ id: 'group-1' });
    const shareRights = buildShareRights({
      visibleGroups: [
        {
          id: 'group-1',
          displayName: 'Group 1',
          labels: ['CommunityAdminGroup'],
        },
      ],
    });

    expect(result.current.isShareRightVisible(shareRight, shareRights)).toBe(
      false,
    );
  });

  it('returns true when the group labels do not include any hidden label', () => {
    const { result } = renderHook(() => useShareRightVisible());
    const shareRight = buildShareRight({ id: 'group-1' });
    const shareRights = buildShareRights({
      visibleGroups: [
        {
          id: 'group-1',
          displayName: 'Group 1',
          labels: ['SomeOtherLabel'],
        },
      ],
    });

    expect(result.current.isShareRightVisible(shareRight, shareRights)).toBe(
      true,
    );
  });
});
