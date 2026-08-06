import { UpdateParameters } from '@edifice.io/client';

import { act, renderHook, waitFor, wrapper } from '~/setup';
import useUpdateMutation from './useUpdateMutation';

const { update } = vi.hoisted(() => ({
  update: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      resource: () => ({
        update,
      }),
    },
  };
});

const buildParams = (
  overrides: Partial<UpdateParameters> = {},
): UpdateParameters => ({
  entId: 'ent-1',
  trashed: false,
  name: 'my-resource',
  thumbnail: 'thumb-url',
  description: 'a description',
  public: false,
  slug: 'my-resource',
  ...overrides,
});

describe('useUpdateMutation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('resolves with the result of odeServices.resource(application).update(params)', async () => {
    const result = { entId: 'ent-1', thumbnail: 'thumb-url' };
    update.mockResolvedValue(result);
    const params = buildParams();

    const { result: hookResult } = renderHook(
      () => useUpdateMutation({ application: 'blog' }),
      { wrapper },
    );

    let mutateResult;
    await act(async () => {
      mutateResult = await hookResult.current.mutateAsync(params);
    });

    expect(update).toHaveBeenCalledWith(params);
    expect(mutateResult).toEqual(result);
  });

  it('surfaces a rejected update as the mutation error state', async () => {
    const error = new Error('update failed');
    update.mockRejectedValue(error);
    const params = buildParams();

    const { result: hookResult } = renderHook(
      () => useUpdateMutation({ application: 'blog' }),
      { wrapper },
    );

    await act(async () => {
      await expect(hookResult.current.mutateAsync(params)).rejects.toThrow(
        'update failed',
      );
    });

    await waitFor(() => expect(hookResult.current.isError).toBe(true));
    expect(hookResult.current.error).toBe(error);
  });
});
