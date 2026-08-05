import { createRef } from 'react';

import { WorkspaceElement } from '@edifice.io/client';

import { act, render, screen, waitFor } from '~/setup';

import {
  FakeMediaStreamInstance,
  installMediaHarness,
  videoInput,
} from '../testing/mediaHarness';
import VideoRecorder, { VideoRecorderRef } from './VideoRecorder';

const {
  getVideoConf,
  uploadBlob,
  useCameras,
  restartStream,
  setPreferedDevice,
} = vi.hoisted(() => ({
  getVideoConf: vi.fn(),
  uploadBlob: vi.fn(),
  useCameras: vi.fn(),
  restartStream: vi.fn(),
  setPreferedDevice: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@edifice.io/client')>()),
  odeServices: { video: () => ({ getVideoConf }) },
}));

vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useUpload: () => ({ uploadBlob }),
}));

// useCameras has its own spec; here it is the seam that hands over a stream.
vi.mock('./useCameras', () => ({ useCameras }));

const video = () => document.querySelector('video') as HTMLVideoElement;
const timer = () => document.querySelector('.video-recorder-time');

const recordButton = () =>
  screen.getByRole('button', { name: 'Start recording' });
const stopButton = () => screen.getByRole('button', { name: 'Stop recording' });
const playButton = () => screen.getByRole('button', { name: 'Play' });
const pauseButton = () =>
  screen.getByRole('button', { name: 'bbm.video.play.pause' });
const resetButton = () => screen.getByRole('button', { name: 'Reset' });
const saveButton = () => screen.getByRole('button', { name: 'Save' });

function setup({
  inputDevices = [videoInput('camera-1')],
  withStream = true,
  ...props
}: {
  inputDevices?: MediaDeviceInfo[];
  withStream?: boolean;
  caption?: string;
  hideSaveAction?: boolean;
} = {}) {
  const harness = installMediaHarness();
  useCameras.mockReturnValue({
    inputDevices,
    setPreferedDevice,
    restartStream,
    stream: withStream ? harness.stream : undefined,
  });

  const onError = vi.fn();
  const onSuccess = vi.fn();
  const onRecordUpdated = vi.fn();
  const ref = createRef<VideoRecorderRef>();

  const view = render(
    <VideoRecorder
      ref={ref}
      appCode="blog"
      onError={onError}
      onSuccess={onSuccess}
      onRecordUpdated={onRecordUpdated}
      {...props}
    />,
  );

  return { ...view, ...harness, onError, onSuccess, onRecordUpdated, ref };
}

/** Records a chunk, then stops — the shortest path to a recorded video. */
async function record(
  harness: ReturnType<typeof setup>,
  chunk = new Blob(['frames'], { type: 'video/webm' }),
) {
  await harness.user.click(recordButton());
  act(() => harness.recorder().emitData(chunk));
  await harness.user.click(stopButton());
}

describe('VideoRecorder', () => {
  beforeAll(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  beforeEach(() => {
    getVideoConf.mockResolvedValue({ maxDuration: 3 });
    uploadBlob.mockResolvedValue({ _id: 'video-id' } as WorkspaceElement);
  });

  describe('layout', () => {
    it('shows the caption it was given', () => {
      setup({ caption: 'Record a video' });

      expect(screen.getByText('Record a video')).toBeInTheDocument();
    });

    it('hides the device picker when there is nothing to pick', () => {
      setup({ inputDevices: [videoInput('camera-1')] });

      expect(document.querySelector('.video-recorder-devices')).toBeNull();
    });

    it('offers the device picker as soon as there are two cameras', () => {
      setup({
        inputDevices: [videoInput('camera-1'), videoInput('camera-2')],
      });

      expect(document.querySelector('.video-recorder-devices')).not.toBeNull();
    });

    it('waits for a stream before showing the toolbar', () => {
      setup({ withStream: false });

      expect(
        screen.queryByRole('button', { name: 'Start recording' }),
      ).toBeNull();
    });

    it('shows no timer before anything is recorded', () => {
      setup();

      expect(timer()).toBeNull();
    });
  });

  describe('preview stream', () => {
    it('feeds the stream to the video element, muted', () => {
      const { stream } = setup();

      expect(video().srcObject).toBe(stream);
      expect(video().muted).toBe(true);
      expect(video().autoplay).toBe(true);
      expect(video().load).toHaveBeenCalled();
    });

    it('releases a previous blob URL before reattaching a stream', async () => {
      const harness = setup();
      await record(harness);
      await waitFor(() => expect(video().src).toContain('blob:'));

      // A brand new stream arrives, as after switching camera: the effect only
      // re-runs on a change of identity.
      const { FakeMediaStream } = await import('../testing/mediaHarness');
      useCameras.mockReturnValue({
        inputDevices: [videoInput('camera-1')],
        setPreferedDevice,
        restartStream,
        stream: new FakeMediaStream() as FakeMediaStreamInstance,
      });
      harness.rerender(
        <VideoRecorder appCode="blog" onError={vi.fn()} onSuccess={vi.fn()} />,
      );

      expect(harness.revokeObjectURL).toHaveBeenCalled();
      // Cleared to '', which jsdom reflects back as the document URL.
      expect(video().src).not.toContain('blob:');
    });
  });

  describe('maximum duration', () => {
    it('reads it from the video configuration', async () => {
      getVideoConf.mockResolvedValue({ maxDuration: 5 });
      const harness = setup();

      await harness.user.click(recordButton());

      await waitFor(() => expect(timer()).toHaveTextContent('/05:00'));
    });

    it('falls back on three minutes when the configuration is unreachable', async () => {
      getVideoConf.mockRejectedValue(new Error('offline'));
      const harness = setup();

      await harness.user.click(recordButton());

      await waitFor(() => expect(timer()).toHaveTextContent('/03:00'));
    });
  });

  describe('recording', () => {
    it('builds a recorder on the current stream with the best mime type', async () => {
      const harness = setup();

      await harness.user.click(recordButton());

      expect(harness.recorder().stream).toBe(harness.stream);
      expect(harness.recorder().mimeType).toBe('video/webm;codecs=vp9');
    });

    it('falls back on a supported mime type', async () => {
      const harness = setup();
      const { FakeMediaRecorder } = await import('../testing/mediaHarness');
      FakeMediaRecorder.unsupported = ['video/webm;codecs=vp9'];
      vi.spyOn(console, 'error').mockImplementation(() => {});

      await harness.user.click(recordButton());

      expect(harness.recorder().mimeType).toBe(
        'video/mp4; codecs="avc1.424028, mp4a.40.2"',
      );
    });

    it('collects the data in one-second slices', async () => {
      const harness = setup();

      await harness.user.click(recordButton());

      expect(harness.recorder().start).toHaveBeenCalledWith(1000);
      expect(harness.recorder().timeslice).toBe(1000);
    });

    it('mutes the preview while recording', async () => {
      const harness = setup();

      await harness.user.click(recordButton());

      expect(video().muted).toBe(true);
    });

    it('ignores empty chunks', async () => {
      const harness = setup();

      await harness.user.click(recordButton());
      act(() => harness.recorder().emitData(new Blob([])));
      await harness.user.click(stopButton());

      expect(harness.onRecordUpdated).not.toHaveBeenCalled();
    });

    it('logs a recorder error', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const harness = setup();

      await harness.user.click(recordButton());
      act(() => harness.recorder().emitError('DeviceLost'));

      expect(error).toHaveBeenCalledWith('DeviceLost');
    });

    it('does nothing without a stream', () => {
      setup({ withStream: false });

      expect(document.querySelectorAll('button')).toHaveLength(0);
    });
  });

  describe('stopping', () => {
    it('flushes the pending data before stopping the recorder', async () => {
      const harness = setup();

      await harness.user.click(recordButton());
      await harness.user.click(stopButton());

      expect(harness.recorder().requestData).toHaveBeenCalled();
      expect(harness.recorder().stop).toHaveBeenCalled();
    });

    it('leaves an already stopped recorder alone', async () => {
      const harness = setup();

      await harness.user.click(recordButton());
      act(() => {
        harness.recorder().state = 'inactive';
      });
      await harness.user.click(stopButton());

      expect(harness.recorder().requestData).not.toHaveBeenCalled();
    });

    it('reports the recording as a blob URL', async () => {
      const harness = setup();

      await record(harness);

      await waitFor(() =>
        expect(harness.onRecordUpdated).toHaveBeenCalledWith(
          expect.stringContaining('blob:'),
        ),
      );
    });

    it('switches the video element from the stream to the recording', async () => {
      const harness = setup();

      await record(harness);

      await waitFor(() => {
        expect(video().srcObject).toBeNull();
        expect(video().src).toContain('blob:');
        expect(video().autoplay).toBe(false);
      });
    });

    it('shows the playback timer once recorded', async () => {
      const harness = setup();

      await record(harness);

      await waitFor(() => expect(timer()).toHaveTextContent('00:00/'));
    });
  });

  describe('elapsed time', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('counts up while recording', async () => {
      const harness = setup();

      await harness.user.click(recordButton());
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(timer()).toHaveTextContent('00:02/');
    });

    it('auto-stops when the maximum duration is reached', async () => {
      getVideoConf.mockResolvedValue({ maxDuration: 0.05 }); // 3 s
      const harness = setup();
      await waitFor(() => expect(getVideoConf).toHaveBeenCalled());

      await harness.user.click(recordButton());
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(harness.recorder().stop).toHaveBeenCalled();
    });

    it('counts up while playing back', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(playButton());
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(timer()).toHaveTextContent('00:01/');
    });
  });

  describe('playback', () => {
    it('unmutes and plays the recording', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(playButton());

      expect(video().muted).toBe(false);
      expect(video().play).toHaveBeenCalled();
    });

    it('pauses on a second click', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(playButton());
      await harness.user.click(pauseButton());

      expect(video().pause).toHaveBeenCalled();
    });

    it('rewinds when the recording ends', async () => {
      const harness = setup();
      await record(harness);
      await harness.user.click(playButton());

      act(() => {
        video().dispatchEvent(new Event('ended'));
      });

      expect(video().currentTime).toBe(0);
      expect(playButton()).toBeInTheDocument();
    });
  });

  describe('reset', () => {
    it('drops the recording and restarts the camera', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(resetButton());

      expect(restartStream).toHaveBeenCalled();
      expect(harness.onRecordUpdated).toHaveBeenLastCalledWith();
      expect(timer()).toBeNull();
    });
  });

  describe('saving', () => {
    it('uploads the recording with its duration', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(saveButton());

      expect(uploadBlob).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.objectContaining({ duration: expect.any(Number) }),
      );
    });

    it('pauses the playback before uploading', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(saveButton());

      expect(video().pause).toHaveBeenCalled();
    });

    it('reports the uploaded document', async () => {
      const harness = setup();
      await record(harness);

      await harness.user.click(saveButton());

      await waitFor(() =>
        expect(harness.onSuccess).toHaveBeenCalledWith([{ _id: 'video-id' }]),
      );
    });

    it('reports a failed upload through onError', async () => {
      uploadBlob.mockResolvedValue(null);
      const harness = setup();
      await record(harness);

      await harness.user.click(saveButton());

      await waitFor(() =>
        expect(harness.onError).toHaveBeenCalledWith(
          'Error while uploading video',
        ),
      );
    });

    it('refuses to upload before anything is recorded', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const harness = setup();

      await act(async () => {
        await harness.ref.current?.save();
      });

      expect(error).toHaveBeenCalledWith(
        'Error while saving video: recorded video is undefined.',
      );
      expect(uploadBlob).not.toHaveBeenCalled();
    });

    it('shows a loading screen during the upload', async () => {
      let release: (value: unknown) => void = () => {};
      uploadBlob.mockReturnValue(new Promise((resolve) => (release = resolve)));
      const harness = setup();
      await record(harness);

      await harness.user.click(saveButton());

      expect(
        screen.getByText('bbm.video.save.loader.caption'),
      ).toBeInTheDocument();
      await act(async () => release({ _id: 'video-id' }));
    });

    it('exposes the save action to the parent through the ref', async () => {
      const harness = setup();
      await record(harness);

      await act(async () => {
        await harness.ref.current?.save();
      });

      expect(uploadBlob).toHaveBeenCalled();
    });

    it('hides the save button when the parent drives the upload', async () => {
      const harness = setup({ hideSaveAction: true });
      await record(harness);

      expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
    });
  });

  describe('switching camera', () => {
    it('selects the matching device', async () => {
      const harness = setup({
        inputDevices: [
          videoInput('camera-1', 'Front'),
          videoInput('camera-2', 'Back'),
        ],
      });

      await harness.user.click(screen.getByRole('combobox'));
      await harness.user.click(screen.getByText('Back'));

      expect(setPreferedDevice).toHaveBeenCalledWith(
        expect.objectContaining({ deviceId: 'camera-2' }),
      );
    });

    it('stops an ongoing recording before switching', async () => {
      const harness = setup({
        inputDevices: [
          videoInput('camera-1', 'Front'),
          videoInput('camera-2', 'Back'),
        ],
      });
      await harness.user.click(recordButton());

      await harness.user.click(screen.getByRole('combobox'));
      await harness.user.click(screen.getByText('Back'));

      expect(harness.recorder().requestData).toHaveBeenCalled();
      expect(harness.recorder().stop).toHaveBeenCalled();
    });
  });
});
