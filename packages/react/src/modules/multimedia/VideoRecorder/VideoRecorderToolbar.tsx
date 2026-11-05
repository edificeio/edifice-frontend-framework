import { WorkspaceElement } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Toolbar, ToolbarItem } from '../../../components';
import {
  IconPause,
  IconPlayFilled,
  IconRecord,
  IconRecordStop,
  IconReset,
  IconSave,
} from '../../icons/components';

export interface VideoRecorderToolbarProps {
  playing: boolean;
  recording: boolean;
  recorded: boolean;
  saving: boolean;
  saved: boolean;
  hideSaveAction: boolean;
  handleRecord: () => void;
  handleStop: () => void;
  handlePlayPause: () => void;
  handleReset: () => void;
  handleSave: () => void;
}

export interface VideoRecorderRef {
  save: () => Promise<WorkspaceElement | undefined>;
}

export const VideoRecorderToolbar = ({
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
}: VideoRecorderToolbarProps) => {
  const { t } = useTranslation();

  const renderLabel = (label: string, disabled: boolean) =>
    disabled ? undefined : (
      <span className="video-recorder-toolbar-label">{label}</span>
    );

  const isRecordDisabled = recording || recorded || saving;
  const isStopDisabled = !recording || recorded || saving;
  const isPlaybackDisabled = !recorded || saving;
  const isSaveDisabled = !recorded || saving || saved;

  const toolbarItems: ToolbarItem[] = [
    {
      type: 'button',
      name: 'record',
      props: {
        leftIcon: <IconRecord />,
        color: 'danger',
        disabled: isRecordDisabled,
        onClick: handleRecord,
        children: renderLabel(t('bbm.video.record.start'), isRecordDisabled),
      },
      tooltip: t('bbm.video.record.start'),
    },
    {
      type: 'button',
      name: 'stop',
      props: {
        leftIcon: <IconRecordStop />,
        disabled: isStopDisabled,
        onClick: handleStop,
        children: renderLabel(t('bbm.video.record.stop'), isStopDisabled),
      },
      tooltip: t('bbm.video.record.stop'),
    },
    {
      type: 'button',
      name: 'play',
      visibility: !playing ? 'show' : 'hide',
      props: {
        leftIcon: <IconPlayFilled />,
        disabled: isPlaybackDisabled,
        onClick: handlePlayPause,
        children: renderLabel(t('bbm.video.play.start'), isPlaybackDisabled),
      },
      tooltip: t('bbm.video.play.start'),
    },
    {
      type: 'button',
      name: 'pause',
      visibility: playing ? 'show' : 'hide',
      props: {
        leftIcon: <IconPause />,
        disabled: isPlaybackDisabled,
        onClick: handlePlayPause,
        children: renderLabel(t('bbm.video.play.pause'), isPlaybackDisabled),
      },
      tooltip: t('bbm.video.play.pause'),
    },
    { type: 'divider' },
    {
      type: 'button',
      name: 'reset',
      props: {
        leftIcon: <IconReset />,
        disabled: isPlaybackDisabled,
        onClick: handleReset,
        children: renderLabel(t('bbm.video.record.reset'), isPlaybackDisabled),
      },
      tooltip: t('bbm.video.record.reset'),
    },
    {
      type: 'button',
      name: 'save',
      visibility: hideSaveAction ? 'hide' : 'show',
      props: {
        leftIcon: <IconSave />,
        disabled: isSaveDisabled,
        onClick: handleSave,
        children: renderLabel(t('bbm.video.record.save'), isSaveDisabled),
      },
      tooltip: t('bbm.video.record.save'),
    },
  ];

  return <Toolbar items={toolbarItems} />;
};
