import { forwardRef, useImperativeHandle } from 'react';

import { WorkspaceElement } from '@edifice.io/client';

import { fireEvent, render, screen, waitFor } from '~/setup';

import { CaptationAudio } from './CaptationAudio';

const { save, toastSuccess, toastError } = vi.hoisted(() => ({
  save: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('../../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../../hooks')>()),
  useToast: () => ({ success: toastSuccess, error: toastError }),
}));

// The recorder needs real media devices: replace it by a stub that exposes
// the same ref API and lets the test provide a record.
vi.mock('../../../../multimedia', () => ({
  AudioRecorder: forwardRef(
    (
      { onRecordUpdated }: { onRecordUpdated?: (url?: string) => void },
      ref,
    ) => {
      useImperativeHandle(ref, () => ({ save }));
      return (
        <button type="button" onClick={() => onRecordUpdated?.('blob:audio')}>
          record
        </button>
      );
    },
  ),
}));

function setup() {
  const onClose = vi.fn();
  const onSaveSuccess = vi.fn();

  render(
    <CaptationAudio isOpen onClose={onClose} onSaveSuccess={onSaveSuccess} />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'record' }));

  return { onClose, onSaveSuccess };
}

const saveButton = () => screen.getByTestId('captation-audio-button-save');

describe('CaptationAudio', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('closes with a success toast once the record is saved', async () => {
    const resource = { _id: 'audio-id' } as WorkspaceElement;
    save.mockResolvedValue(resource);
    const { onClose, onSaveSuccess } = setup();

    fireEvent.click(saveButton());

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSaveSuccess).toHaveBeenCalledWith(resource);
    expect(toastSuccess).toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows an error toast and stays open when nothing was saved', async () => {
    save.mockResolvedValue(undefined);
    const { onClose, onSaveSuccess } = setup();

    fireEvent.click(saveButton());

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(onSaveSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows an error toast and re-enables saving when the upload fails', async () => {
    save.mockRejectedValue(new Error('network'));
    const { onClose } = setup();

    fireEvent.click(saveButton());

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
    expect(saveButton()).toBeEnabled();
  });
});
