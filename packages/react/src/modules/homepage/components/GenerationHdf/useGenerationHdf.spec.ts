import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGenerationHdf } from './useGenerationHdf';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  isResponseError: vi.fn(),
  getPreference: vi.fn(),
  savePreference: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  USER_PREFS: { CURSUS: 'cursus' },
  odeServices: {
    http: () => ({
      get: mocks.get,
      isResponseError: mocks.isResponseError,
      latestResponse: { statusText: 'Error' },
    }),
    conf: () => ({
      getPreference: mocks.getPreference,
      savePreference: mocks.savePreference,
    }),
  },
}));

describe('useGenerationHdf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isResponseError.mockReturnValue(false);
    mocks.getPreference.mockResolvedValue({});
    mocks.savePreference.mockResolvedValue(undefined);
  });

  it('starts idle when no card number is stored as a preference', async () => {
    const { result } = renderHook(() => useGenerationHdf());

    await waitFor(() => {
      expect(result.current.status).toBe('idle');
    });
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it('auto-connects with the stored card number on mount', async () => {
    mocks.getPreference.mockResolvedValue({ cardNb: '475948' });
    mocks.get.mockResolvedValue({
      sales: [{ numPM: 'PM1', solde: '1234' }],
      wallets: [{ code: 'PM1', libelle: 'Manuels et équipements' }],
    });

    const { result } = renderHook(() => useGenerationHdf());

    await waitFor(() => {
      expect(result.current.status).toBe('account');
    });
    expect(result.current.cardNumber).toBe('475948');
    expect(result.current.wallets).toEqual([
      { label: 'Manuels et équipements', amount: '12,34 €' },
    ]);
  });

  it('falls back to the error status when the stored card number is rejected', async () => {
    mocks.getPreference.mockResolvedValue({ cardNb: '000000' });
    mocks.isResponseError.mockReturnValue(true);
    mocks.get.mockResolvedValue({ sales: [], wallets: [] });

    const { result } = renderHook(() => useGenerationHdf());

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
  });

  it('submits the typed card number and saves it as a preference on success', async () => {
    mocks.get.mockResolvedValue({
      sales: [{ numPM: 'PM1', solde: '5' }],
      wallets: [{ code: 'PM1', libelle: 'Restauration' }],
    });

    const { result } = renderHook(() => useGenerationHdf());
    await waitFor(() => expect(result.current.status).toBe('idle'));

    act(() => {
      result.current.onCardNumberChange('123456');
    });
    act(() => {
      result.current.onSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('account');
    });
    expect(result.current.wallets).toEqual([
      { label: 'Restauration', amount: '0,05 €' },
    ]);
    expect(mocks.savePreference).toHaveBeenCalledWith('cursus', {
      cardNb: '123456',
    });
  });

  it('sets the error status when the submitted card number is rejected', async () => {
    mocks.isResponseError.mockReturnValue(true);
    mocks.get.mockResolvedValue({ sales: [], wallets: [] });

    const { result } = renderHook(() => useGenerationHdf());
    await waitFor(() => expect(result.current.status).toBe('idle'));

    act(() => {
      result.current.onCardNumberChange('000000');
    });
    act(() => {
      result.current.onSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
    expect(mocks.savePreference).not.toHaveBeenCalled();
  });

  it('clears the stored preference and resets state when editing', async () => {
    mocks.getPreference.mockResolvedValue({ cardNb: '475948' });
    mocks.get.mockResolvedValue({
      sales: [{ numPM: 'PM1', solde: '1234' }],
      wallets: [{ code: 'PM1', libelle: 'Manuels et équipements' }],
    });

    const { result } = renderHook(() => useGenerationHdf());
    await waitFor(() => expect(result.current.status).toBe('account'));

    act(() => {
      result.current.onEdit();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.cardNumber).toBe('');
    expect(result.current.wallets).toEqual([]);
    expect(mocks.savePreference).toHaveBeenCalledWith('cursus', {});
  });

  it('only clears the local field when using onClear', async () => {
    const { result } = renderHook(() => useGenerationHdf());
    await waitFor(() => expect(result.current.status).toBe('idle'));

    act(() => {
      result.current.onCardNumberChange('123456');
    });
    act(() => {
      result.current.onClear();
    });

    expect(result.current.cardNumber).toBe('');
    expect(result.current.status).toBe('idle');
    expect(mocks.savePreference).not.toHaveBeenCalled();
  });
});
