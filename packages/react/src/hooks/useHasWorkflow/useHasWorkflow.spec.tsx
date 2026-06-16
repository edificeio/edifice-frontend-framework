import { renderHook, waitFor } from '~/setup';
import useHasWorkflow from './useHasWorkflow';

const { hasWorkflowRight, hasWorkflowRights } = vi.hoisted(() => ({
  hasWorkflowRight: vi.fn(),
  hasWorkflowRights: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    rights: () => ({
      sessionHasWorkflowRight: hasWorkflowRight,
      sessionHasWorkflowRights: hasWorkflowRights,
    }),
  },
}));

describe('useHasWorkflow', () => {
  it('is undefined until the right has been resolved', () => {
    hasWorkflowRight.mockResolvedValue(true);

    const { result } = renderHook(() => useHasWorkflow('workflow.create'));

    expect(result.current).toBeUndefined();
  });

  it('resolves a single workflow right as a boolean', async () => {
    hasWorkflowRight.mockResolvedValue(true);

    const { result } = renderHook(() => useHasWorkflow('workflow.create'));

    await waitFor(() => expect(result.current).toBe(true));
    expect(hasWorkflowRight).toHaveBeenCalledWith('workflow.create');
  });

  it('resolves multiple workflow rights as a record', async () => {
    const rights = { 'workflow.create': true, 'workflow.delete': false };
    hasWorkflowRights.mockResolvedValue(rights);

    const { result } = renderHook(() =>
      useHasWorkflow(['workflow.create', 'workflow.delete']),
    );

    await waitFor(() => expect(result.current).toEqual(rights));
    expect(hasWorkflowRights).toHaveBeenCalledWith([
      'workflow.create',
      'workflow.delete',
    ]);
  });
});
