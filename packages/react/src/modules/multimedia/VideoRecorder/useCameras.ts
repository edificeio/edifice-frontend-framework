/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';

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
      video: {
        facingMode: 'environment',
        aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
      },
    });

  // Video stream from the prefered camera. Need to be started by calling `startStreaming()`.
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    initInputDevices();
  }, []);

  // Enable video stream and stop streaming on clean up.
  useEffect(() => {
    if (!stream) {
      resetStream();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream, inputDevices, mediaStreamConstraints]);

  /** Detect available cameras. */
  async function getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === 'videoinput');
  }

  /** Initialize the inputDevices state. */
  async function initInputDevices() {
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

  /**
   * Try enable a stream with the selected constraints.
   * The navigator may ask the user permission of using it.
   */
  async function enableStream(mediaStreamConstraints: MediaStreamConstraints) {
    try {
      const mediaStream: MediaStream =
        await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
      setStream(mediaStream);
    } catch (err) {
      console.error(err);
    }
  }

  const resetStream = useCallback(() => {
    console.log('startStreaming');
    stopStreaming();
    enableStream(mediaStreamConstraints);
  }, [mediaStreamConstraints]);

  const setPreferedDevice = useCallback(
    (device?: MediaDeviceInfo) => {
      let mediaStreamConstraints: MediaStreamConstraints = {};
      if (device?.deviceId) {
        if (device?.deviceId === 'environment' || device?.deviceId === 'user') {
          mediaStreamConstraints = {
            audio: true,
            video: {
              aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
              facingMode: device?.deviceId,
            },
          };
        } else {
          mediaStreamConstraints = {
            audio: true,
            video: {
              aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
              deviceId: device.deviceId,
            },
          };
        }
        setMediaStreamConstraints(mediaStreamConstraints);
        resetStream();
      } else {
        console.error('Selected input device id is null');
      }
    },
    [resetStream],
  );

  const isStreaming = useMemo(() => typeof stream !== 'undefined', [stream]);

  const stopStreaming = useCallback(() => {
    if (isStreaming) {
      stream?.getTracks().forEach((track) => track.stop());
      setStream(undefined);
    }
  }, [stream]);

  return {
    /** Readonly list (array) of available video input devices. */
    inputDevices,
    /** Select which input video device to use. */
    setPreferedDevice,
    /** The current video stream. */
    stream,
    /** Start a video stream from the default or selected device. */
    resetStream,
  };
}
