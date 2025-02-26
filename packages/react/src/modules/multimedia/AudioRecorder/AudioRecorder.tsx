import { forwardRef, useImperativeHandle, useState } from 'react';

import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { FormControl, Input, Toolbar } from '../../../components';
import { IconMic } from '../../icons/components';
import AudioRecorderTimer from './AudioRecorderTimer';
import useAudioRecorder from './useAudioRecorder';

export interface AudioRecorderProps {
  onSaveSuccess?: (resource: WorkspaceElement) => void;
  onRecordUpdated?: (recordURL?: string) => void;
  hideSaveAction?: boolean;
  visibility?: WorkspaceVisibility;
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

    const classColor = clsx({
      'text-danger': recordState === 'RECORDING',
      'text-success': playState === 'PLAYING',
    });

    const handleTimeUpdate = (event: any) => {
      setAudioTime(event.target.currentTime);
    };

    return (
      <div className="audio-recorder m-auto d-flex flex-column">
        <FormControl
          id="recordName"
          className="mb-32"
          isRequired
          isReadOnly={recordState === 'SAVED' || recordState === 'SAVING'}
        >
          <Input
            type="text"
            size={'sm'}
            placeholder={t('bbm.audio.recorder.name')}
            ref={audioNameRef}
            defaultValue={getDefaultDate()}
          />
        </FormControl>
        <div className="audio-recorder-icon mx-auto">
          <IconMic width={64} height={64} className={classColor} />
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
    );
  },
);

export default AudioRecorder;
