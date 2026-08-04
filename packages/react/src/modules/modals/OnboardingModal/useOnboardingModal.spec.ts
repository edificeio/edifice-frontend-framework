import { act, renderHook, waitFor } from '~/setup';
import { useOnboardingModal } from './useOnboardingModal';

const { getPreference, savePreference } = vi.hoisted(() => ({
  getPreference: vi.fn(),
  savePreference: vi.fn(),
}));

vi.mock('../../../hooks/usePreferences', () => ({
  usePreferences: () => ({
    getPreference,
    savePreference,
  }),
}));

describe('useOnboardingModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('opens and marks onboarding when the stored key is true and no display rule is given', async () => {
    getPreference.mockResolvedValue({ key: true });

    // No applyDisplayRule is passed here on purpose, to exercise the branch
    // where the caller relies on the raw stored key instead of a custom rule.
    const { result } = renderHook(() =>
      (useOnboardingModal as any)('onboarding-id'),
    );

    await waitFor(() => expect(result.current.isOpen).toBe(true));
    expect(result.current.isOnboarding).toBe(true);
  });

  it('keeps the modal closed when the stored key is falsy and no display rule is given', async () => {
    getPreference.mockResolvedValue({ key: false });

    const { result } = renderHook(() =>
      (useOnboardingModal as any)('onboarding-id'),
    );

    await waitFor(() => expect(getPreference).toHaveBeenCalled());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isOnboarding).toBe(false);
  });

  it('delegates to applyDisplayRule when it is provided and a preference exists', async () => {
    getPreference.mockResolvedValue({ key: 'previous-state' });
    savePreference.mockResolvedValue(undefined);
    const applyDisplayRule = vi.fn().mockReturnValue({
      display: true,
      nextState: 'next-state',
    });

    const { result } = renderHook(() =>
      useOnboardingModal('onboarding-id', applyDisplayRule),
    );

    await waitFor(() => expect(result.current.isOpen).toBe(true));
    expect(applyDisplayRule).toHaveBeenCalledWith('previous-state');
    expect(result.current.isOnboarding).toBe(true);

    // state.current is not exposed by the hook, so its value is asserted
    // indirectly: handleSavePreference must persist the nextState computed
    // by applyDisplayRule during the mount effect.
    await act(async () => {
      await result.current.handleSavePreference();
    });

    expect(savePreference).toHaveBeenCalledWith({ key: 'next-state' });
  });

  it('opens and marks onboarding when there is no stored preference at all', async () => {
    getPreference.mockResolvedValue(undefined);
    savePreference.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useOnboardingModal('onboarding-id', vi.fn()),
    );

    await waitFor(() => expect(result.current.isOpen).toBe(true));
    expect(result.current.isOnboarding).toBe(true);

    // state.current stays undefined in this branch: handleSavePreference
    // should persist { key: undefined }.
    await act(async () => {
      await result.current.handleSavePreference();
    });

    expect(savePreference).toHaveBeenCalledWith({ key: undefined });
  });

  it('saves the preference and closes the modal on handleSavePreference', async () => {
    getPreference.mockResolvedValue({ key: true });
    savePreference.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      (useOnboardingModal as any)('onboarding-id'),
    );

    await waitFor(() => expect(result.current.isOpen).toBe(true));

    await act(async () => {
      await result.current.handleSavePreference();
    });

    expect(savePreference).toHaveBeenCalledWith({ key: undefined });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isOnboarding).toBe(false);
  });
});
