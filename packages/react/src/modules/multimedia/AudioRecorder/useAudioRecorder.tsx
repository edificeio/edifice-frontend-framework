import { useCallback, useEffect, useReducer, useRef } from 'react';

import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { ToolbarItem } from '../../../components';
import { useWorkspaceFile } from '../../../hooks';
import {
  IconLoader,
  IconPause,
  IconPlayFilled,
  IconRecord,
  IconRecordPause,
  IconRefresh,
  IconRestart,
  IconSave,
} from '../../icons/components';

export type RecordState =
  | 'IDLE'
  | 'RECORDING'
  | 'PAUSED'
  | 'RECORDED'
  | 'SAVING'
  | 'SAVED';

export type PlayState = 'IDLE' | 'PLAYING' | 'PAUSED';

type AudioReducerState = {
  recordState: RecordState;
  playState: PlayState;
  isEncoding: boolean;

  // The audio recorder is based on the Web Audio API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  // See also https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode for more information.
  micStream?: MediaStream;
  micStreamAudioSourceNode?: MediaStreamAudioSourceNode;
  audioWorkletNode?: AudioWorkletNode;
  audioContext?: AudioContext;

  // encoder and web socket for sending encoded audio to the backend
  encoderWorker?: Worker;

  recordTime: number;
  // max duration in s (3 minutes by default)
  maxDuration: number;
};

export default function useAudioRecorder(
  onSaveSuccess?: (resource: WorkspaceElement) => void,
  onUpdateRecord?: (audioUrl?: string) => void,
  hideSaveAction: boolean = false,
  visibility: WorkspaceVisibility = 'protected',
  application: string = 'media-library',
) {
  function audioReducer(
    state: AudioReducerState,
    action: {
      type: 'update';
      updatedState?: Partial<AudioReducerState>;
    },
  ): AudioReducerState {
    return { ...state, ...action.updatedState };
  }

  const [
    {
      recordState,
      playState,
      micStream,
      micStreamAudioSourceNode,
      audioWorkletNode,
      audioContext,
      encoderWorker,
      maxDuration,
      recordTime,
      isEncoding,
    },
    dispatch,
  ] = useReducer(audioReducer, {
    recordState: 'IDLE',
    isEncoding: false,
    playState: 'IDLE',
    recordTime: 0,
    maxDuration: 180, // max duration in s (3 minutes by default)
  });
  const audioNameRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const leftChannelRef = useRef<Float32Array[]>();
  const rightChannelRef = useRef<Float32Array[]>();

  const { t } = useTranslation();
  const { create } = useWorkspaceFile();

  const BUFFER_SIZE: number = 128; // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
  const DEFAULT_SAMPLE_RATE: number = 48000;

  // Init Web Socket to send audio chunks to backend
  useEffect(() => {
    const encoderWorker = new Worker('/infra/public/js/audioEncoder.js');
    dispatch({
      type: 'update',
      updatedState: { encoderWorker: encoderWorker },
    });
    encoderWorker.postMessage([
      'init',
      audioContext?.sampleRate || DEFAULT_SAMPLE_RATE,
    ]);

    return () => {
      closeAudioStream();
      encoderWorker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle message received from the audio recorder processor.
   * Basically the Audio recorder processor returns the input channels that will be treated by the audioEncoder worker.
   * The audio recorder processor script is located here: /infra/public/js/audio-recorder-processor.js
   * The script follows the AudioWorkletProcessor API (https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor)
   * This method gets called for each block of 128 sample-frames.
   *
   * @param event is the input returned, containing leftChannel and rightChannel arrays.
   */
  const handleAudioWorkletNodeMessage = (event: MessageEvent) => {
    const leftChannel = (event.data.inputs as Float32Array[][])[0][0];
    let rightChannel = (event.data.inputs as Float32Array[][])[0][1];
    if (
      !rightChannel ||
      rightChannel.filter((data) => data !== undefined).length === 0
    ) {
      rightChannel = leftChannel;
    }
    leftChannelRef.current?.push(leftChannel);
    rightChannelRef.current?.push(rightChannel);
  };

  /**
   * Close opened audio stream and clean channels
   */
  const closeAudioStream = useCallback(() => {
    // Close audio stream
    micStream?.getTracks().forEach((track) => track.stop());
    micStreamAudioSourceNode?.disconnect();
    audioWorkletNode?.port.removeEventListener(
      'message',
      handleAudioWorkletNodeMessage,
    );
    audioWorkletNode?.port.close();
    audioWorkletNode?.disconnect();
    audioContext?.close();
  }, [audioContext, audioWorkletNode, micStream, micStreamAudioSourceNode]);

  const initRecording = async () => {
    // Request access to the user's microphone
    const micStream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // Create the microphone stream
    const audioContext = new AudioContext({ sampleRate: DEFAULT_SAMPLE_RATE });
    const micStreamAudioSourceNode: MediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(micStream);

    // Create and connect AudioWorkletNode for processing the audio stream
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
    try {
      await audioContext.audioWorklet.addModule(
        '/infra/public/js/audio-recorder-processor.js',
      );
    } catch (err) {
      console.error(err);
    }

    const audioWorkletNode = new AudioWorkletNode(
      audioContext,
      'audio-recorder-processor',
    );

    // Message received from the audio recorder processor. cf handleAudioWorkletNodeMessage function.
    // Basically the Audio recorder processor returns the input channels that will be treated by the audioEncoder worker.
    audioWorkletNode.port.addEventListener(
      'message',
      handleAudioWorkletNodeMessage,
    );

    // Store the audio context and stream in the state, reset record time and set states
    dispatch({
      type: 'update',
      updatedState: {
        micStream,
        micStreamAudioSourceNode,
        audioContext,
        recordTime: 0,
        audioWorkletNode,
        recordState: 'RECORDING',
        playState: 'IDLE',
      },
    });

    // Clean audio channels
    rightChannelRef.current = [];
    leftChannelRef.current = [];

    audioWorkletNode.port.start();

    micStreamAudioSourceNode.connect(audioWorkletNode);
    audioWorkletNode.connect(audioContext.destination);
  };

  const handleRecord = useCallback(async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    if (recordState === 'PAUSED') {
      // Resume recording
      dispatch({
        type: 'update',
        updatedState: { recordState: 'RECORDING', playState: 'IDLE' },
      });
      audioContext?.resume();
      onUpdateRecord?.(undefined);
    } else {
      // Start new recording
      initRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordState, audioContext, audioRef]);

  const handleRecordPause = useCallback(() => {
    dispatch({
      type: 'update',
      updatedState: {
        recordState: 'PAUSED',
        playState: 'IDLE',
        isEncoding: true,
      },
    });
    audioContext?.suspend();
    if (encoderWorker && leftChannelRef.current && rightChannelRef.current) {
      // Encode audio
      encoderWorker.postMessage([
        'wav',
        rightChannelRef.current,
        leftChannelRef.current,
        rightChannelRef.current.length * BUFFER_SIZE,
      ]);
      encoderWorker.onmessage = (event: MessageEvent) => {
        const audioUrl = window.URL.createObjectURL(event.data);

        dispatch({
          type: 'update',
          updatedState: { isEncoding: false },
        });

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }

        if (onUpdateRecord) {
          onUpdateRecord(audioUrl);
        }
      };
    }
  }, [audioContext, encoderWorker, onUpdateRecord]);

  const handlePlay = useCallback(() => {
    dispatch({ type: 'update', updatedState: { playState: 'PLAYING' } });
    if (audioRef?.current?.currentTime) {
      audioRef.current.play();
    } else {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [audioRef]);

  const handlePlayPause = useCallback(() => {
    audioRef?.current?.pause();
    dispatch({ type: 'update', updatedState: { playState: 'PAUSED' } });
  }, [audioRef]);

  const handleReset = useCallback(() => {
    closeAudioStream();

    dispatch({
      type: 'update',
      updatedState: {
        playState: 'IDLE',
        recordState: 'IDLE',
      },
    });

    // Clean channels
    rightChannelRef.current = [];
    leftChannelRef.current = [];

    if (onUpdateRecord) {
      onUpdateRecord(undefined);
    }
  }, [closeAudioStream, onUpdateRecord]);

  const handleSave: () => Promise<WorkspaceElement | undefined> =
    useCallback(async () => {
      const audioName = audioNameRef.current?.value;
      if (!audioName) {
        console.error('Audio name is required');
        return;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      dispatch({
        type: 'update',
        updatedState: { recordState: 'SAVING', playState: 'IDLE' },
      });
      return new Promise<WorkspaceElement | undefined>((resolve, reject) => {
        try {
          if (
            encoderWorker &&
            leftChannelRef.current &&
            rightChannelRef.current
          ) {
            encoderWorker.postMessage([
              'mp3',
              rightChannelRef.current,
              leftChannelRef.current,
              rightChannelRef.current.length * BUFFER_SIZE,
            ]);

            encoderWorker.onmessage = async (event: MessageEvent) => {
              if (event.data instanceof Blob) {
                const file = new File([event.data], audioName!, {
                  type: 'audio/mp3',
                });

                const resourceAudio = await create(file, {
                  application,
                  visibility,
                });

                if (resourceAudio && onSaveSuccess) {
                  onSaveSuccess(resourceAudio);
                }

                dispatch({
                  type: 'update',
                  updatedState: { recordState: 'SAVED' },
                });

                resolve(resourceAudio);
              }
            };
          }
        } catch (error) {
          dispatch({
            type: 'update',
            updatedState: { playState: 'IDLE', recordState: 'IDLE' },
          });
          console.error('Error while saving', error);
          reject();
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordState, onSaveSuccess, closeAudioStream]);

  const handlePlayStop = useCallback(() => {
    // Stop Playing the record
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    dispatch({ type: 'update', updatedState: { playState: 'IDLE' } });
  }, [audioRef]);

  const handlePlayEnded = useCallback(() => {
    dispatch({ type: 'update', updatedState: { playState: 'PAUSED' } });
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [audioRef]);

  /**
   * Auto-stop recording when max allowed duration is reached.
   */
  useEffect(() => {
    if (recordState === 'RECORDING' && audioContext) {
      const timer = window.setInterval(
        // Compute exact elapsed time by diffing the start time.
        () => {
          dispatch({
            type: 'update',
            updatedState: {
              recordTime: audioContext.currentTime,
            },
          });

          if (audioContext.currentTime >= maxDuration) {
            handleRecordPause();
            window.clearInterval(timer);
          }
        },
        100,
      );

      return () => window.clearInterval(timer);
    }
  }, [audioContext, handleRecordPause, maxDuration, recordState]);

  const recordText =
    recordState === 'IDLE'
      ? t('bbm.audio.record.start')
      : t('bbm.audio.record.resume');

  const toolbarItems: ToolbarItem[] = [
    {
      type: 'icon',
      name: 'record',
      visibility: recordState === 'RECORDING' ? 'hide' : 'show',
      props: {
        'icon': <IconRecord />,
        'color': 'danger',
        'disabled':
          (recordState !== 'IDLE' && recordState !== 'PAUSED') ||
          recordTime >= maxDuration,
        'onClick': handleRecord,
        'aria-label': recordText,
      },
      tooltip: recordText,
    },
    {
      type: 'icon',
      name: 'recordPause',
      visibility: recordState === 'RECORDING' ? 'show' : 'hide',
      props: {
        'icon': <IconRecordPause />,
        'color': 'danger',
        'disabled': recordState !== 'RECORDING',
        'onClick': handleRecordPause,
        'aria-label': t('bbm.audio.record.pause'),
      },
      tooltip: t('bbm.audio.record.pause'),
    },
    { type: 'divider' },
    {
      type: 'icon',
      name: 'encoding',
      visibility: isEncoding ? 'show' : 'hide',
      props: {
        icon: <IconLoader style={{ animation: 'loading 1s infinite' }} />,
        disabled: true,
      },
    },
    {
      type: 'icon',
      name: 'play',
      visibility: isEncoding || playState === 'PLAYING' ? 'hide' : 'show',
      props: {
        'icon': <IconPlayFilled />,
        'disabled':
          recordState !== 'RECORDED' &&
          recordState !== 'PAUSED' &&
          recordState !== 'SAVED',
        'onClick': handlePlay,
        'aria-label': t('bbm.audio.play.start'),
      },
      tooltip: t('bbm.audio.play.start'),
    },
    {
      type: 'icon',
      name: 'playPause',
      visibility: !isEncoding && playState === 'PLAYING' ? 'show' : 'hide',
      props: {
        'icon': <IconPause />,
        'onClick': handlePlayPause,
        'aria-label': t('bbm.audio.play.pause'),
      },
      tooltip: t('bbm.audio.play.pause'),
    },
    {
      type: 'icon',
      name: 'stop',
      props: {
        'icon': <IconRestart />,
        'disabled': playState !== 'PLAYING' && playState !== 'PAUSED',
        'onClick': handlePlayStop,
        'aria-label': t('bbm.audio.play.stop'),
      },
      tooltip: t('bbm.audio.play.stop'),
    },
    { type: 'divider' },
    {
      type: 'icon',
      name: 'reset',
      props: {
        'icon': <IconRefresh />,
        'disabled':
          recordState !== 'RECORDED' &&
          recordState !== 'PAUSED' &&
          playState !== 'PLAYING' &&
          playState !== 'PAUSED',
        'onClick': handleReset,
        'aria-label': t('bbm.audio.record.reset'),
      },
      tooltip: t('bbm.audio.record.reset'),
    },
    {
      type: 'icon',
      name: 'save',
      visibility: hideSaveAction ? 'hide' : 'show',
      props: {
        'icon': <IconSave />,
        'disabled':
          (recordState !== 'RECORDED' &&
            recordState !== 'PAUSED' &&
            playState !== 'PLAYING' &&
            playState !== 'PAUSED') ||
          recordState === 'SAVED' ||
          !audioNameRef.current?.value,
        'onClick': handleSave,
        'aria-label': t('bbm.audio.record.save'),
      },
      tooltip: t('bbm.audio.record.save'),
    },
  ];

  return {
    recordState,
    playState,
    audioContext,
    recordTime: recordTime * 1000,
    maxDuration: maxDuration * 1000,
    audioRef,
    audioNameRef,
    toolbarItems,
    handlePlayEnded,
    handleSave,
  };
}
