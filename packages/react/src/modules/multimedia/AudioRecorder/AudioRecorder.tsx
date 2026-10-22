import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react';

import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  Input,
  InputProps,
  Toolbar,
  ToolbarItem,
} from '../../../components';
import { IconMic } from '../../icons/components';
import AudioRecorderTimer from './AudioRecorderTimer';
import useAudioRecorder from './useAudioRecorder';

export interface AudioRecorderProps {
  onSaveSuccess?: (resource: WorkspaceElement) => void;
  onRecordUpdated?: (recordURL?: string) => void;
  hideSaveAction?: boolean;
  visibility?: WorkspaceVisibility;
  /** Extra class names on the root element, to restyle the recorder. */
  className?: string;
  /** Optional label rendered above the record name input. */
  nameLabel?: ReactNode;
  /** Extra props forwarded to the record name input (override defaults). */
  nameInputProps?: Omit<Partial<InputProps>, 'ref'>;
  /** Class name of the record name FormControl (defaults to `mb-32`). */
  nameFormControlClassName?: string;
  /** Customizes the toolbar items computed by the recorder. */
  customizeToolbarItems?: (items: ToolbarItem[]) => ToolbarItem[];
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
      className,
      nameLabel,
      nameInputProps,
      nameFormControlClassName = 'mb-32',
      customizeToolbarItems,
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
      <div
        className={clsx('audio-recorder m-auto d-flex flex-column', className)}
      >
        <FormControl
          id="recordName"
          className={nameFormControlClassName}
          isRequired
          isReadOnly={recordState === 'SAVED' || recordState === 'SAVING'}
        >
          {nameLabel}
          <Input
            type="text"
            size={'sm'}
            placeholder={t('bbm.audio.recorder.name')}
            defaultValue={getDefaultDate()}
            {...nameInputProps}
            // Keep last: the hook reads the record name from this ref
            ref={audioNameRef}
          />
        </FormControl>
        <div className="audio-recorder-controls d-flex flex-column">
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
          <Toolbar
            items={
              customizeToolbarItems
                ? customizeToolbarItems(toolbarItems)
                : toolbarItems
            }
          />
        </div>
      </div>
    );
  },
);

export default AudioRecorder;
