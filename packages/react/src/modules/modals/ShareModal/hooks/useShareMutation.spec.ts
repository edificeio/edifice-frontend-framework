import { ShareRight } from '@edifice.io/client';

import { act, renderHook, waitFor, wrapper } from '~/setup';
import useShareMutation from './useShareMutation';

const { saveRights } = vi.hoisted(() => ({
  saveRights: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      share: () => ({
        saveRights,
      }),
    },
  };
});

const buildShareRight = (overrides: Partial<ShareRight> = {}): ShareRight => ({
  id: 'right-1',
  type: 'user',
  displayName: 'Right 1',
  avatarUrl: '',
  directoryUrl: '',
  actions: [],
  ...overrides,
});

describe('useShareMutation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves with the result of odeServices.share().saveRights(application, resourceId, rights)', async () => {
    const result = { 'notify-timeline-array': [] };
    saveRights.mockResolvedValue(result);
    const rights = [buildShareRight()];

    const { result: hookResult } = renderHook(
      () => useShareMutation({ application: 'blog' }),
      { wrapper },
    );

    let mutateResult;
    await act(async () => {
      mutateResult = await hookResult.current.mutateAsync({
        resourceId: 'resource-1',
        rights,
      });
    });

    expect(saveRights).toHaveBeenCalledWith('blog', 'resource-1', rights);
    expect(mutateResult).toEqual(result);
  });

  it('surfaces a rejected saveRights call as the mutation error state', async () => {
    const error = new Error('saveRights failed');
    saveRights.mockRejectedValue(error);
    const rights = [buildShareRight()];

    const { result: hookResult } = renderHook(
      () => useShareMutation({ application: 'blog' }),
      { wrapper },
    );

    await act(async () => {
      await expect(
        hookResult.current.mutateAsync({ resourceId: 'resource-1', rights }),
      ).rejects.toThrow('saveRights failed');
    });

    await waitFor(() => expect(hookResult.current.isError).toBe(true));
    expect(hookResult.current.error).toBe(error);
  });
});
