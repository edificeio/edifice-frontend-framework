import { forwardRef, useImperativeHandle, useState } from 'react';

import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { FormControl, Input, Label, Toolbar } from '../../../components';
import { IconMic } from '../../icons/components';
import AudioRecorderTimer from './AudioRecorderTimer';
import useAudioRecorder from './useAudioRecorder';

export interface AudioRecorderProps {
  onSaveSuccess?: (resource: WorkspaceElement) => void;
  onRecordUpdated?: (recordURL?: string) => void;
  hideSaveAction?: boolean;
  visibility?: WorkspaceVisibility;
  /** Called with the record name each time the user edits it. */
  onNameChange?: (name: string) => void;
}

export interface AudioRecorderRef {
  save: () => Promise<WorkspaceElement | undefined>;
}

const AudioRecorder = forwardRef(
  (
    {
      onSaveSuccess,
      onRecordUpdated,
      hideSaveAction = false,
      visibility = 'protected',
      onNameChange,
    }: AudioRecorderProps,
    ref,
  ) => {
    const {
      recordState,
      playState,
      recordTime,
      audioRef,
      audioNameRef,
      toolbarItems,
      micError,
      maxDuration,
      handlePlayEnded,
      handleSave,
    } = useAudioRecorder(
      onSaveSuccess,
      onRecordUpdated,
      hideSaveAction,
      visibility,
      'media-library',
    );
    const { t } = useTranslation();

    function getDefaultDate() {
      const d = new Date();
      return (
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(d.getDate()).padStart(2, '0')} ${String(
          d.getHours(),
        ).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')} ` +
        ' ' +
        t('bbm.audio.recorder.defaultName')
      );
    }

    // We add one methods to handle save action from parent component
    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    const [audioTime, setAudioTime] = useState<number>(0);

    const iconClassName = clsx('audio-recorder-icon', {
      'audio-recorder-icon--recording': recordState === 'RECORDING',
      'audio-recorder-icon--playing': playState === 'PLAYING',
    });

    const handleTimeUpdate = (event: any) => {
      setAudioTime(event.target.currentTime);
    };

    if (micError) {
      return (
        <div className="audio-recorder-error">
          <div
            className="audio-recorder-error-illustration"
            aria-hidden="true"
          />
          <div className="audio-recorder-error-text">
            <p className="audio-recorder-error-title">
              {t('bbm.audio.recorder.device.error.title')}
            </p>
            <p className="audio-recorder-error-description">
              {t('bbm.audio.recorder.device.error.text')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="audio-recorder">
        <FormControl
          id="recordName"
          isRequired
          isReadOnly={recordState === 'SAVED' || recordState === 'SAVING'}
        >
          <Label leftIcon={<IconMic width={18} height={18} />}>
            {t('bbm.audio.recorder.name.label')}
          </Label>
          <Input
            type="text"
            size="lg"
            maxLength={80}
            showCounter
            placeholder={t('bbm.audio.recorder.name')}
            defaultValue={getDefaultDate()}
            onChange={(event) => onNameChange?.(event.target.value)}
            ref={audioNameRef}
          />
        </FormControl>
        <div className="audio-recorder-controls">
          <div className={iconClassName}>
            <IconMic width={64} height={64} />
          </div>
          <AudioRecorderTimer
            recordState={recordState}
            playState={playState}
            recordTime={recordTime}
            audioTime={audioTime}
            maxDuration={maxDuration}
          ></AudioRecorderTimer>
          <audio
            ref={audioRef}
            onEnded={handlePlayEnded}
            onTimeUpdate={handleTimeUpdate}
          >
            <track default kind="captions" srcLang="fr" src=""></track>
          </audio>
          <Toolbar items={toolbarItems} />
        </div>
      </div>
    );
  },
);

export default AudioRecorder;
