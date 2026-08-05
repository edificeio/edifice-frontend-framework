import { act, renderHook, waitFor } from '~/setup';

import {
  FakeMediaStream,
  FakeMediaStreamInstance,
  audioInput,
  installMediaHarness,
  videoInput,
} from '../testing/mediaHarness';
import { useCameras } from './useCameras';

const { useBrowserInfo } = vi.hoisted(() => ({
  useBrowserInfo: vi.fn(() => ({ device: { type: undefined } })),
}));

// Only useBrowserInfo is doubled: the barrel is shared with the components.
vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useBrowserInfo,
}));

const DESKTOP = { device: { type: undefined } };
const MOBILE = { device: { type: 'mobile' } };
const TABLET = { device: { type: 'tablet' } };

function setup({
  devices = [videoInput('camera-1'), audioInput()],
  platform = DESKTOP,
}: {
  devices?: MediaDeviceInfo[];
  platform?: { device: { type: string | undefined } };
} = {}) {
  useBrowserInfo.mockReturnValue(platform as never);
  const harness = installMediaHarness({ devices });
  const view = renderHook(() => useCameras());
  return { ...view, ...harness };
}

describe('useCameras', () => {
  describe('opening a stream', () => {
    it('asks for audio and video by default', async () => {
      const { getUserMedia } = setup();

      await waitFor(() =>
        expect(getUserMedia).toHaveBeenCalledWith({
          audio: true,
          video: true,
        }),
      );
    });

    it('exposes the acquired stream', async () => {
      const { result, stream } = setup();

      await waitFor(() => expect(result.current.stream).toBe(stream));
    });

    it('asks for the stream twice on mount', async () => {
      const { getUserMedia } = setup();

      // One call from the effect watching the constraints, one from the effect
      // listing the devices. Both hit the permission prompt on a real browser.
      await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(2));
    });

    it('logs the refusal and stays without a stream', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result, getUserMedia } = setup();
      getUserMedia.mockRejectedValue(new Error('NotAllowedError'));

      await act(async () => {
        result.current.restartStream();
      });

      expect(error).toHaveBeenCalled();
    });
  });

  describe('listing the cameras', () => {
    it('keeps only the video inputs', async () => {
      const { result } = setup({
        devices: [videoInput('camera-1'), audioInput(), videoInput('camera-2')],
      });

      await waitFor(() =>
        expect(result.current.inputDevices.map((d) => d.deviceId)).toEqual([
          'camera-1',
          'camera-2',
        ]),
      );
    });

    it('reports no camera when the device has none', async () => {
      const { result } = setup({ devices: [audioInput()] });

      await waitFor(() => expect(result.current.inputDevices).toEqual([]));
    });

    it.each([
      ['mobile', MOBILE],
      ['tablet', TABLET],
    ])(
      'offers front and back cameras on a %s with several of them',
      async (_platform, browser) => {
        const { result } = setup({
          devices: [videoInput('camera-1'), videoInput('camera-2')],
          platform: browser,
        });

        await waitFor(() =>
          expect(result.current.inputDevices.map((d) => d.deviceId)).toEqual([
            'environment',
            'user',
          ]),
        );
      },
    );

    it('leaves the single camera to the system on a mobile', async () => {
      const { result } = setup({
        devices: [videoInput('camera-1')],
        platform: MOBILE,
      });

      await waitFor(() =>
        expect(result.current.inputDevices.map((d) => d.deviceId)).toEqual([
          'environment',
        ]),
      );
    });

    it('labels the mobile cameras front and back', async () => {
      const { result } = setup({
        devices: [videoInput('camera-1'), videoInput('camera-2')],
        platform: MOBILE,
      });

      await waitFor(() =>
        expect(result.current.inputDevices.map((d) => d.label)).toEqual([
          'video.back.camera',
          'video.front.camera',
        ]),
      );
    });
  });

  describe('choosing a camera', () => {
    it('constrains the stream to the selected device', async () => {
      const { result, getUserMedia } = setup();
      await waitFor(() => expect(result.current.stream).toBeDefined());

      await act(async () => {
        result.current.setPreferedDevice(videoInput('camera-2'));
      });

      expect(getUserMedia).toHaveBeenLastCalledWith({
        audio: true,
        video: {
          aspectRatio: 16 / 9,
          deviceId: { exact: 'camera-2' },
        },
      });
    });

    it.each(['environment', 'user'])(
      'switches to the %s facing camera instead of pinning a device id',
      async (facing) => {
        const { result, getUserMedia } = setup();
        await waitFor(() => expect(result.current.stream).toBeDefined());

        await act(async () => {
          result.current.setPreferedDevice(videoInput(facing));
        });

        expect(getUserMedia).toHaveBeenLastCalledWith({
          audio: true,
          video: { aspectRatio: 16 / 9, facingMode: facing },
        });
      },
    );

    it('refuses a device without an id', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result, getUserMedia } = setup();
      await waitFor(() => expect(result.current.stream).toBeDefined());
      const callsBefore = getUserMedia.mock.calls.length;

      await act(async () => {
        result.current.setPreferedDevice(undefined);
      });

      expect(error).toHaveBeenCalledWith('Selected input device id is null');
      expect(getUserMedia).toHaveBeenCalledTimes(callsBefore);
    });
  });

  describe('restarting the stream', () => {
    it('releases the previous tracks before acquiring a new one', async () => {
      const first = new FakeMediaStream() as FakeMediaStreamInstance;
      const { result, getUserMedia } = setup();
      getUserMedia.mockResolvedValue(first);
      await act(async () => {
        result.current.restartStream();
      });
      await waitFor(() => expect(result.current.stream).toBe(first));

      await act(async () => {
        result.current.restartStream();
      });

      first
        .getTracks()
        .forEach((track) => expect(track.stop).toHaveBeenCalled());
    });

    it('keeps the current constraints', async () => {
      const { result, getUserMedia } = setup();
      await waitFor(() => expect(result.current.stream).toBeDefined());

      await act(async () => {
        result.current.setPreferedDevice(videoInput('camera-2'));
      });
      await act(async () => {
        result.current.restartStream();
      });

      expect(getUserMedia).toHaveBeenLastCalledWith(
        expect.objectContaining({
          video: expect.objectContaining({ deviceId: { exact: 'camera-2' } }),
        }),
      );
    });
  });
});
