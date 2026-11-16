/* eslint-disable react-hooks/exhaustive-deps */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { WorkspaceElement, odeServices } from '@edifice.io/client';
import { convertMsToMS, getBestSupportedMimeType } from '@edifice.io/utilities';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Input,
  Label,
  LoadingScreen,
  OptionsType,
  Select,
} from '../../../components';
import { useDate, useUpload } from '../../../hooks';
import { IconRecord, IconRecordVideo } from '../../icons/components';
import { useCameras } from './useCameras';
import { VideoRecorderToolbar } from './VideoRecorderToolbar';

export interface VideoRecorderProps {
  appCode: string;
  /**
   * @deprecated Not part of the recorder design anymore, will be removed in
   * a future major version.
   */
  caption?: string;
  onSuccess?: (res: WorkspaceElement[]) => void;
  onError: (error: string) => void;
  onRecordUpdated?: (recordURL?: string) => void;
  hideSaveAction?: boolean;
  /** Called with the record name each time the user edits it. */
  onNameChange?: (name: string) => void;
}

export interface VideoRecorderRef {
  save: () => Promise<WorkspaceElement | undefined>;
}

const VideoRecorder = forwardRef(
  (
    {
      appCode,
      onSuccess,
      onError,
      onRecordUpdated,
      hideSaveAction = false,
      onNameChange,
    }: VideoRecorderProps,
    ref,
  ) => {
    const {
      inputDevices,
      setPreferedDevice,
      restartStream,
      stream,
      streamError,
    } = useCameras();

    const [maxDuration, setMaxDuration] = useState<number>(180000);

    const [recording, setRecording] = useState<boolean>(false);
    const [recorded, setRecorded] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);

    const [mimeType, setMimeType] = useState<string>('');

    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recordedVideo, setRecordedVideo] = useState<Blob>();

    const [recordedTime, setRecordedTime] = useState<number>(0);
    const [playedTime, setPlayedTime] = useState<number>(0);

    const previewRef = useRef<HTMLVideoElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);

    const { uploadBlob } = useUpload(undefined, appCode);

    // We add one methods to handle save action from parent component
    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    const { t } = useTranslation();
    const { formatDate } = useDate();

    const [recordName, setRecordName] = useState<string>(() =>
      `${t('bbm.video.recorder.defaultName')} ${formatDate(new Date(), 'YYYY/MM/DD HH[h]mm')}`.trim(),
    );

    const handleNameChange = (name: string) => {
      setRecordName(name);
      onNameChange?.(name);
    };

    useEffect(() => {
      initMaxDuration();
    }, []);

    /**
     * Get max duration from Conf.
     */
    async function initMaxDuration() {
      try {
        const videoConfResponse = await odeServices.video().getVideoConf();
        setMaxDuration(videoConfResponse.maxDuration * 60 * 1000);
      } catch {
        setMaxDuration(3 * 60 * 1000);
      }
    }

    useEffect(() => {
      const preview = previewRef.current;
      if (!preview) return;
      try {
        preview.srcObject = stream ?? null;
        if (stream) {
          preview.autoplay = true;
          preview.muted = true;
          preview.load();
        }
      } catch (err) {
        console.error(err);
      }
    }, [stream]);

    /** Stop the playback and release the recording it was showing. */
    const clearPlayback = () => {
      const video = videoRef.current;
      if (!video?.src) return;
      video.pause();
      window.URL.revokeObjectURL(video.src);
      video.removeAttribute('src');
      video.load();
    };

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
        if (videoRef.current.src) {
          window.URL.revokeObjectURL(videoRef.current.src);
        }
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

    const handleRecord = useCallback(() => {
      setRecording(true);

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

      if (recorderRef.current?.state === 'recording') {
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
      setPlayedTime(0);
      setRecordedChunks([]);
      setRecordedVideo(undefined);

      clearPlayback();

      const isStreamAlive =
        !!stream &&
        stream.getTracks().every((track) => track.readyState !== 'ended');
      if (!isStreamAlive) {
        restartStream();
      }

      onRecordUpdated?.();
    };

    const handleSave = async () => {
      // WB-3012, stop any playing video before saving it.
      videoRef?.current?.pause();
      if (!recordedVideo) {
        console.error('Error while saving video: recorded video is undefined.');
        return;
      }

      setSaving(true);
      try {
        const resVideo = await uploadBlob(recordedVideo, {
          filename: recordName.trim(),
          duration: recordedTime,
        });

        if (resVideo != null) {
          onSuccess?.([resVideo]);
          setSaved(true);
          return [resVideo];
        }
        onError('Error while uploading video');
      } catch (error) {
        console.error(error);
        onError('Error while uploading video');
      } finally {
        setSaving(false);
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
      // Stop any recording.
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.requestData();
        recorderRef.current.stop();
      }

      setPreferedDevice(selectedDevice);
    };

    /**
     * Auto-stop recording when max allowed duration is reached.
     */
    useEffect(() => {
      if (recordedTime >= maxDuration) {
        handleStop();
      }
    }, [recordedTime, handleStop]);

    if (streamError) {
      return (
        <div className="video-recorder-error">
          <div
            className="video-recorder-error-illustration"
            aria-hidden="true"
          />
          <div className="video-recorder-error-text">
            <p className="video-recorder-error-title">
              {t('bbm.video.recorder.device.error.title')}
            </p>
            <p className="video-recorder-error-description">
              {t('bbm.video.recorder.device.error.text')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="video-recorder">
        <FormControl id="recordName" isRequired isReadOnly={saving || saved}>
          <Label leftIcon={<IconRecordVideo width={18} height={18} />}>
            {t('bbm.video.recorder.name.label')}
          </Label>
          <Input
            type="text"
            size="lg"
            maxLength={80}
            showCounter
            value={recordName}
            placeholder={t('bbm.video.recorder.name')}
            onChange={(event) => handleNameChange(event.target.value)}
          />
        </FormControl>
        {inputDevices.length > 1 && (
          <div className="video-recorder-devices">
            <FormControl id="selectInputDevice">
              <Label>{t('bbm.video.record.select.devices.label')}</Label>
              <Select
                placeholderOption={t(
                  'bbm.video.record.select.devices.placeholder',
                )}
                options={inputDevices.map(
                  (videoInputDevice) => videoInputDevice.label,
                )}
                onValueChange={handleInputDeviceChange}
              />
            </FormControl>
          </div>
        )}

        <div className="video-recorder-video-container">
          <div className="video-recorder-placeholder">
            <IconRecordVideo width={60} height={60} />
          </div>
          <video
            ref={previewRef}
            className="video-recorder-preview"
            playsInline={true}
            autoPlay={true}
            controls={false}
            muted={true}
          >
            <track default kind="captions" srcLang="fr" src=""></track>
          </video>
          <video
            ref={videoRef}
            className="video-recorder-playback"
            hidden={!recorded}
            playsInline={true}
            controls={false}
            muted={true}
            onEnded={handleEnded}
          >
            <track default kind="captions" srcLang="fr" src=""></track>
          </video>
          <div className="video-recorder-time">
            {!recording && !recorded && (
              <>
                <IconRecordVideo width={18} height={18} />
                <span>
                  {convertMsToMS(0)}/{convertMsToMS(maxDuration)}
                </span>
              </>
            )}
            {recording && (
              <>
                <IconRecord
                  width={12}
                  height={12}
                  className="video-recorder-time-recording"
                />
                <span>
                  {convertMsToMS(recordedTime)}/{convertMsToMS(maxDuration)}
                </span>
              </>
            )}
            {recorded && (
              <>
                <IconRecordVideo width={18} height={18} />
                <span>
                  {convertMsToMS(playedTime)}/{convertMsToMS(recordedTime)}
                </span>
              </>
            )}
          </div>
          {stream && (
            <VideoRecorderToolbar
              {...{
                playing,
                recording,
                recorded,
                saving,
                saved,
                hideSaveAction,
                handleRecord,
                handleStop,
                handlePlayPause,
                handleReset,
                handleSave,
              }}
            />
          )}
        </div>
        {saving && (
          <LoadingScreen
            position={false}
            caption={t('bbm.video.save.loader.caption')}
          />
        )}
      </div>
    );
  },
);

export default VideoRecorder;
