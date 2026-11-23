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

  describe('close confirmation', () => {
    const confirmModal = () =>
      screen.queryByTestId(
        'captation-audio-close-confirm-modal-button-confirm',
      );

    it.each([
      [
        'the cancel button',
        () =>
          fireEvent.click(screen.getByTestId('captation-audio-button-cancel')),
      ],
      [
        'the close button',
        () => fireEvent.click(screen.getByRole('button', { name: /close/i })),
      ],
      ['a click outside', () => fireEvent.mouseDown(document.body)],
      [
        'the Escape key',
        () => fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' }),
      ],
    ])('asks for confirmation before closing on %s', (_, close) => {
      const { onClose } = setup();

      close();

      expect(confirmModal()).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('closes the modal once the user confirms', () => {
      const { onClose } = setup();
      fireEvent.click(screen.getByTestId('captation-audio-button-cancel'));

      fireEvent.mouseDown(confirmModal()!);
      fireEvent.click(confirmModal()!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('keeps the modal open when the user goes back to it', () => {
      const { onClose } = setup();
      fireEvent.click(screen.getByTestId('captation-audio-button-cancel'));

      const back = screen.getByTestId(
        'captation-audio-close-confirm-modal-button-cancel',
      );
      fireEvent.mouseDown(back);
      fireEvent.click(back);

      expect(confirmModal()).not.toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
      expect(
        screen.getByTestId('captation-audio-button-save'),
      ).toBeInTheDocument();
    });
  });
});
