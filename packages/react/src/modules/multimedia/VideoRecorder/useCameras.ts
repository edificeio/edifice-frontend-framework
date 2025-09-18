/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useBrowserInfo } from '../../../hooks';

const VIDEO_HEIGHT = 9;
const VIDEO_WIDTH = 16;

export function useCameras() {
  const { device } = useBrowserInfo(navigator.userAgent);
  const { t } = useTranslation();

  // List of available cameras.
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);

  // Constraints used to select which camera to use.
  const [mediaStreamConstraints, setMediaStreamConstraints] =
    useState<MediaStreamConstraints>({
      audio: true,
      video: true,
    });

  // Video stream from the default or prefered camera.
  const [stream, setStream] = useState<MediaStream>();

  /** Detect available cameras. */
  async function getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === 'videoinput');
  }

  /**
   * Try enabling a stream with the selected constraints.
   * The navigator may ask the user permission of using it.
   */
  const enableStream = async (constraints: MediaStreamConstraints) => {
    try {
      // Aquire new stream
      const mediaStream: MediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      // Use it
      setStream(mediaStream);
    } catch (err) {
      console.error(err);
    }
  };

  const restartStream = () => {
    // Stop previous stream
    stream?.getTracks().forEach((track) => track.stop());

    enableStream(mediaStreamConstraints);
  };

  const setPreferedDevice = (device?: MediaDeviceInfo) => {
    let constraints: MediaStreamConstraints = {};

    if (device?.deviceId) {
      if (device.deviceId === 'environment' || device.deviceId === 'user') {
        constraints = {
          audio: true,
          video: {
            aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
            facingMode: device?.deviceId,
          },
        };
      } else {
        constraints = {
          audio: true,
          video: {
            aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
            deviceId: { exact: device.deviceId },
          },
        };
      }
      setMediaStreamConstraints(constraints);
    } else {
      console.error('Selected input device id is null');
    }
  };

  useEffect(() => {
    restartStream();
  }, [mediaStreamConstraints]);

  useEffect(() => {
    // Initialize the inputDevices state to find available cameras.
    async function initInputDevices() {
      // Try accessing the default camera at first, in order to ask user's consent
      await enableStream(mediaStreamConstraints);
      const videoDevices = await getVideoInputDevices();
      // Possible type: console, mobile, tablet, smarttv, wearable, embedded
      switch (device.type) {
        case 'mobile':
        case 'tablet': {
          const backCamera = {
            deviceId: 'environment',
            label: t('video.back.camera'),
            groupId: '',
            kind: 'videoinput',
          } as MediaDeviceInfo;
          const frontCamera = {
            deviceId: 'user',
            label: t('video.front.camera'),
            groupId: '',
            kind: 'videoinput',
          } as MediaDeviceInfo;

          if (videoDevices?.length > 1) {
            // mobile/tablet has more than 1 camera
            setInputDevices([backCamera, frontCamera]);
          } else {
            // else we let the system use the only one that exists (or none)
            setInputDevices([backCamera]);
          }
          break;
        }
        default:
          // "Desktop" or other future types => list all cameras without distinction.
          setInputDevices(videoDevices);
          break;
      }
    }
    initInputDevices();
  }, []);

  return {
    /** Readonly list (array) of available video input devices. */
    inputDevices,
    /** Select which input video device to use. */
    setPreferedDevice,
    /** The current video stream. */
    stream,
    /** Start a video stream from the default or prefered device. */
    restartStream,
  };
}
