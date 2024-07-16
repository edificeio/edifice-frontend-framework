/* eslint-disable react-hooks/exhaustive-deps */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  Pause,
  PlayFilled,
  Record,
  RecordStop,
  RecordVideo,
  Refresh,
  Save,
} from "@edifice-ui/icons";
import { WorkspaceElement, odeServices } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  Label,
  LoadingScreen,
  OptionsType,
  Select,
} from "../../components";
import { Toolbar, ToolbarItem } from "../../components/Toolbar";
import { useUpload } from "../../core/useUpload";
import useBrowserInfo from "../../hooks/useBrowserInfo/useBrowserInfo";
import { convertMsToMS, getBestSupportedMimeType } from "../../utils";

export interface VideoRecorderProps {
  appCode: string;
  caption?: string;
  onSuccess?: (res: WorkspaceElement[]) => void;
  onError: (error: string) => void;
  onRecordUpdated?: (recordURL?: string) => void;
  hideSaveAction?: boolean;
}

const VIDEO_HEIGHT = 9;
const VIDEO_WIDTH = 16;

export interface VideoRecorderRef {
  save: () => Promise<WorkspaceElement | undefined>;
}

const VideoRecorder = forwardRef(
  (
    {
      appCode,
      caption,
      onSuccess,
      onError,
      onRecordUpdated,
      hideSaveAction = false,
    }: VideoRecorderProps,
    ref,
  ) => {
    const [maxDuration, setMaxDuration] = useState<number>(180000);
    const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);

    const [recording, setRecording] = useState<boolean>(false);
    const [recorded, setRecorded] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);

    const [mediaStreamConstraints, setMediaStreamConstraints] =
      useState<MediaStreamConstraints>({
        audio: true,
        video: {
          facingMode: "environment",
          aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
        },
      });
    const [stream, setStream] = useState<MediaStream>();
    const [mimeType, setMimeType] = useState<string>("");

    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recordedVideo, setRecordedVideo] = useState<Blob>();

    const [recordedTime, setRecordedTime] = useState<number>(0);
    const [playedTime, setPlayedTime] = useState<number>(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);

    const { uploadBlob } = useUpload(undefined, appCode);

    const { device } = useBrowserInfo(navigator.userAgent);

    // We add one methods to handle save action from parent component
    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    const { t } = useTranslation();

    /**
     * Get max duration from Conf and input devices list.
     */
    useEffect(() => {
      initMaxDuration();
      initInputDevices();
    }, []);

    /**
     * Enable video stream and stop streaming on clean up.
     */
    useEffect(() => {
      if (!stream) {
        enableStream(mediaStreamConstraints);
      }
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [stream]);

    /**
     * Get last updated recorded chunk and set the recorded video as source for user to watch it.
     */
    useEffect(() => {
      if (recordedChunks.length && !recording && videoRef.current) {
        const finalVideo: Blob = new Blob(recordedChunks, { type: mimeType });
        setRecordedVideo(finalVideo);

        if (onRecordUpdated) {
          const videoUrl = window.URL.createObjectURL(finalVideo);
          onRecordUpdated(videoUrl);
        }
        videoRef.current.autoplay = false;
        videoRef.current.srcObject = null;
        videoRef.current.src = window.URL.createObjectURL(finalVideo);
      }
    }, [recording, recordedChunks]);

    /**
     * Handle recording countup.
     * Recording cannot be paused.
     */
    useEffect(() => {
      if (recording) {
        // Get the start timestamp.
        const startedAt = Date.now();
        const timer = window.setInterval(
          // Compute exact elapsed time by diffing the start time.
          () => setRecordedTime(Date.now() - startedAt),
          500,
        );

        return () => {
          window.clearInterval(timer);
        };
      }
    }, [recording]);

    /**
     * Handle playing countup.
     * Playing can be paused and resumed.
     */
    useEffect(() => {
      if (playing) {
        // Compute an approximative elapsed time by cumulating small inaccurate values.
        const timer = window.setInterval(
          () => setPlayedTime((prev) => prev + 500),
          500,
        );

        return () => {
          window.clearInterval(timer);
        };
      }
    }, [playing]);

    const initMaxDuration = async () => {
      const videoConfResponse = await odeServices.video().getVideoConf();
      setMaxDuration((videoConfResponse.maxDuration ?? 3) * 60 * 1000);
    };

    const initInputDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      // console, mobile, tablet, smarttv, wearable, embedded
      switch (device.type) {
        case "mobile":
        case "tablet": {
          const backCamera = {
            deviceId: "environment",
            label: t("video.back.camera"),
            groupId: "",
            kind: "videoinput",
          } as MediaDeviceInfo;
          const frontCamera = {
            deviceId: "user",
            label: t("video.front.camera"),
            groupId: "",
            kind: "videoinput",
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
    };

    const enableStream = async (
      mediaStreamConstraints: MediaStreamConstraints,
    ) => {
      try {
        const mediaStream: MediaStream =
          await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
        setStream(mediaStream);

        if (videoRef.current) {
          if (videoRef.current.src) {
            window.URL.revokeObjectURL(videoRef.current.src);
            videoRef.current.src = "";
          }
          videoRef.current.srcObject = mediaStream;
          videoRef.current.autoplay = true;
          videoRef.current.volume = 1;
          videoRef.current.muted = true;
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleRecord = useCallback(() => {
      setRecording(true);

      if (videoRef && videoRef.current) {
        videoRef.current.muted = true;
      }

      const mimeType = getBestSupportedMimeType();
      setMimeType(mimeType);

      if (stream) {
        recorderRef.current = new MediaRecorder(stream, { mimeType });
        recorderRef.current.ondataavailable = ({ data }: BlobEvent) => {
          if (data.size > 0) {
            setRecordedChunks((prev) => [...prev, data]);
          }
        };
        recorderRef.current.onerror = (event) => console.error(event);
        recorderRef.current.start(1000); // collect 1000ms of data
      }
    }, [stream]);

    const handleStop = useCallback(() => {
      setRecording(false);
      setRecorded(true);

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.requestData();
        recorderRef.current.stop();
      }
    }, [recorderRef]);

    const handlePlayPause = useCallback(() => {
      if (videoRef && videoRef.current) {
        videoRef.current.muted = false;
      }

      if (!playing) {
        videoRef?.current?.play();
        setPlaying(true);
      } else {
        videoRef?.current?.pause();
        setPlaying(false);
      }
    }, [playing]);

    const handleReset = () => {
      setRecorded(false);
      setRecording(false);
      setPlaying(false);
      setSaved(false);
      setRecordedTime(0);
      setRecordedChunks([]);
      setRecordedVideo(undefined);
      enableStream(mediaStreamConstraints);

      if (onRecordUpdated) {
        onRecordUpdated();
      }
    };

    const handleSave = async () => {
      setSaving(true);
      if (!recordedVideo) {
        console.error("Error while saving video: recorded video is undefined.");
        return;
      }

      const resVideo = await uploadBlob(recordedVideo, {
        duration: recordedTime,
      });

      if (resVideo != null) {
        onSuccess?.([resVideo]);
        setSaving(false);
        setSaved(true);
        return [resVideo];
      } else {
        onError("Error while uploading video");
        setSaving(false);
        setSaved(true);
      }
    };

    const handleEnded = () => {
      setPlaying(false);
      setPlayedTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    };

    const handleInputDeviceChange = (option: OptionsType | string) => {
      const selectedDevice = inputDevices.find(
        (inputDevice) => inputDevice.label === option,
      );

      let mediaStreamConstraints: MediaStreamConstraints = {};
      if (selectedDevice?.deviceId) {
        if (
          selectedDevice?.deviceId === "environment" ||
          selectedDevice?.deviceId === "user"
        ) {
          mediaStreamConstraints = {
            audio: true,
            video: {
              aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
              facingMode: selectedDevice?.deviceId,
            },
          };
        } else {
          mediaStreamConstraints = {
            audio: true,
            video: {
              aspectRatio: VIDEO_WIDTH / VIDEO_HEIGHT,
              deviceId: selectedDevice.deviceId,
            },
          };
        }

        setMediaStreamConstraints(mediaStreamConstraints);

        if (stream) {
          if (recorderRef.current?.state === "recording") {
            recorderRef.current.requestData();
            recorderRef.current.stop();
          }
          stream.getTracks().forEach((track) => track.stop());
          setStream(undefined);
        }
        enableStream(mediaStreamConstraints);
      } else {
        console.error("Selected input device id is null");
      }
    };

    /**
     * Auto-stop recording when max allowed duration is reached.
     */
    useEffect(() => {
      if (recordedTime >= maxDuration) {
        handleStop();
      }
    }, [recordedTime, handleStop]);

    const toolbarItems: ToolbarItem[] = [
      {
        type: "icon",
        name: "record",
        props: {
          "icon": <Record color={recording || recorded ? "" : "red"} />,
          "color": "danger",
          "disabled": recording || recorded || saving,
          "onClick": handleRecord,
          "aria-label": t("bbm.video.record.start"),
        },
        tooltip: t("bbm.video.record.start"),
      },
      {
        type: "icon",
        name: "stop",
        props: {
          "icon": <RecordStop />,
          "disabled": !recording || recorded || saving,
          "onClick": handleStop,
          "aria-label": t("bbm.video.record.stop"),
        },
        tooltip: t("bbm.video.record.stop"),
      },
      {
        type: "icon",
        name: "play",
        visibility: !playing ? "show" : "hide",
        props: {
          "icon": <PlayFilled />,
          "disabled": !recorded || saving,
          "onClick": handlePlayPause,
          "aria-label": t("bbm.video.play.start"),
        },
        tooltip: t("bbm.video.play.start"),
      },
      {
        type: "icon",
        name: "pause",
        visibility: playing ? "show" : "hide",
        props: {
          "icon": <Pause />,
          "disabled": !recorded || saving,
          "onClick": handlePlayPause,
          "aria-label": t("bbm.video.play.pause"),
        },
        tooltip: t("bbm.video.play.pause"),
      },
      { type: "divider" },
      {
        type: "icon",
        name: "reset",
        props: {
          "icon": <Refresh />,
          "disabled": !recorded || saving,
          "onClick": handleReset,
          "aria-label": t("bbm.video.record.reset"),
        },
        tooltip: t("bbm.video.record.reset"),
      },
      {
        type: "icon",
        name: "save",
        visibility: hideSaveAction ? "hide" : "show",
        props: {
          "icon": <Save />,
          "disabled": !recorded || saving || saved,
          "onClick": handleSave,
          "aria-label": t("bbm.video.record.save"),
        },
        tooltip: t("bbm.video.record.save"),
      },
    ];

    return (
      <div className="video-recorder d-flex flex-fill flex-column align-items-center pb-8">
        <div className="video-recorder-caption d-none d-md-block">
          {caption}
        </div>
        {inputDevices.length > 1 && (
          <div className="video-recorder-devices mb-12">
            <FormControl id="selectInputDevice">
              <Label className="d-none d-md-block">
                {t("bbm.video.record.select.devices.label")}
              </Label>
              <Select
                placeholderOption={t(
                  "bbm.video.record.select.devices.placeholder",
                )}
                options={inputDevices.map(
                  (videoInputDevice) => videoInputDevice.label,
                )}
                onValueChange={handleInputDeviceChange}
              />
            </FormControl>
          </div>
        )}

        <div className="video-recorder-video-container position-relative align-self-stretch">
          <video
            ref={videoRef}
            playsInline={true}
            autoPlay={true}
            controls={false}
            muted={true}
            onEnded={handleEnded}
            className="rounded"
          >
            <track default kind="captions" srcLang="fr" src=""></track>
          </video>
          {(recording || recorded) && (
            <div className="video-recorder-time d-flex align-items-center font-monospace fs-6 text-bg-dark rounded">
              {recording && (
                <>
                  <Record width={12} height={12} color="red" className="me-4" />
                  <span>
                    {convertMsToMS(recordedTime)}/{convertMsToMS(maxDuration)}
                  </span>
                </>
              )}
              {recorded && (
                <>
                  <RecordVideo width={14} height={14} className="me-4" />
                  <span>
                    {convertMsToMS(playedTime)}/{convertMsToMS(recordedTime)}
                  </span>
                </>
              )}
            </div>
          )}
          {stream && (
            <Toolbar
              items={toolbarItems}
              className="position-absolute bottom-0 start-50 bg-white"
            />
          )}
        </div>
        {saving && (
          <LoadingScreen
            position={false}
            caption={t("bbm.video.save.loader.caption")}
          />
        )}
      </div>
    );
  },
);

export default VideoRecorder;
