import { ShareRight, ShareRightWithVisibles } from '@edifice.io/client';
import { renderHook } from '~/setup';
import { useShareRightDisabled } from './useShareRightDisabled';

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

describe('useShareRightDisabled', () => {
  it('returns false when shareRight type is not group', () => {
    const { result } = renderHook(() => useShareRightDisabled());
    const shareRight = buildShareRight({ type: 'user' });
    const shareRights = buildShareRights();

    expect(result.current.isShareRightDisabled(shareRight, shareRights)).toBe(
      false,
    );
  });

  it('returns false when the group is not found in visibleGroups', () => {
    const { result } = renderHook(() => useShareRightDisabled());
    const shareRight = buildShareRight({ id: 'unknown-group' });
    const shareRights = buildShareRights({
      visibleGroups: [{ id: 'other-group', displayName: 'Other group' }],
    });

    expect(result.current.isShareRightDisabled(shareRight, shareRights)).toBe(
      false,
    );
  });

  it('returns false when the group is found but labels are undefined', () => {
    const { result } = renderHook(() => useShareRightDisabled());
    const shareRight = buildShareRight({ id: 'group-1' });
    const shareRights = buildShareRights({
      visibleGroups: [{ id: 'group-1', displayName: 'Group 1' }],
    });

    expect(result.current.isShareRightDisabled(shareRight, shareRights)).toBe(
      false,
    );
  });

  it('returns false when the group is found but labels is not an array', () => {
    const { result } = renderHook(() => useShareRightDisabled());
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

    expect(result.current.isShareRightDisabled(shareRight, shareRights)).toBe(
      false,
    );
  });

  it('returns true when the group labels include a disabled label', () => {
    const { result } = renderHook(() => useShareRightDisabled());
    const shareRight = buildShareRight({ id: 'group-1' });
    const shareRights = buildShareRights({
      visibleGroups: [
        {
          id: 'group-1',
          displayName: 'Group 1',
          labels: ['CommunityMemberGroup'],
        },
      ],
    });

    expect(result.current.isShareRightDisabled(shareRight, shareRights)).toBe(
      true,
    );
  });

  it('returns false when the group labels do not include any disabled label', () => {
    const { result } = renderHook(() => useShareRightDisabled());
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

    expect(result.current.isShareRightDisabled(shareRight, shareRights)).toBe(
      false,
    );
  });
});
