import { forwardRef, useImperativeHandle } from 'react';

import { WorkspaceElement } from '@edifice.io/client';

import { fireEvent, render, screen, waitFor } from '~/setup';

import { CaptationVideo } from './CaptationVideo';

const { save, toastSuccess, toastError } = vi.hoisted(() => ({
  save: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('../../../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../../hooks')>()),
  useToast: () => ({ success: toastSuccess, error: toastError }),
}));

type RecorderStubProps = {
  onRecordUpdated?: (url?: string) => void;
  onNameChange?: (name: string) => void;
  onSuccess?: (resources: WorkspaceElement[]) => void;
  onError: (error: string) => void;
};

// The recorder needs real media devices: replace it by a stub that exposes
// the same ref API and lets the test drive its callbacks.
vi.mock('../../../../multimedia', () => ({
  VideoRecorder: forwardRef((props: RecorderStubProps, ref) => {
    useImperativeHandle(ref, () => ({ save: () => save(props) }));
    return (
      <>
        <button
          type="button"
          onClick={() => props.onRecordUpdated?.('blob:video')}
        >
          record
        </button>
        <button type="button" onClick={() => props.onNameChange?.('  ')}>
          clear name
        </button>
      </>
    );
  }),
}));

function setup() {
  const onClose = vi.fn();
  const onSaveSuccess = vi.fn();

  render(
    <CaptationVideo isOpen onClose={onClose} onSaveSuccess={onSaveSuccess} />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'record' }));

  return { onClose, onSaveSuccess };
}

const saveButton = () => screen.getByTestId('captation-video-button-save');

describe('CaptationVideo', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('closes with a success toast once the video is saved', async () => {
    const resource = { _id: 'video-id' } as WorkspaceElement;
    save.mockImplementation(async ({ onSuccess }: RecorderStubProps) =>
      onSuccess?.([resource]),
    );
    const { onClose, onSaveSuccess } = setup();

    fireEvent.click(saveButton());

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSaveSuccess).toHaveBeenCalledWith(resource);
    expect(toastSuccess).toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows an error toast and stays open when the upload fails', async () => {
    save.mockImplementation(async ({ onError }: RecorderStubProps) =>
      onError('Error while uploading video'),
    );
    const { onClose, onSaveSuccess } = setup();

    fireEvent.click(saveButton());

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(onSaveSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(saveButton()).toBeEnabled();
  });

  it('cannot save a video without a name', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'clear name' }));

    expect(saveButton()).toBeDisabled();
  });
});
