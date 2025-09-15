/* eslint-disable react-hooks/exhaustive-deps */

import { WorkspaceElement } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Toolbar, ToolbarItem } from '../../../components';
import {
  IconPause,
  IconPlayFilled,
  IconRecord,
  IconRecordStop,
  IconRefresh,
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

  const toolbarItems: ToolbarItem[] = [
    {
      type: 'icon',
      name: 'record',
      props: {
        'icon': <IconRecord color={recording || recorded ? '' : 'red'} />,
        'color': 'danger',
        'disabled': recording || recorded || saving,
        'onClick': handleRecord,
        'aria-label': t('bbm.video.record.start'),
      },
      tooltip: t('bbm.video.record.start'),
    },
    {
      type: 'icon',
      name: 'stop',
      props: {
        'icon': <IconRecordStop />,
        'disabled': !recording || recorded || saving,
        'onClick': handleStop,
        'aria-label': t('bbm.video.record.stop'),
      },
      tooltip: t('bbm.video.record.stop'),
    },
    {
      type: 'icon',
      name: 'play',
      visibility: !playing ? 'show' : 'hide',
      props: {
        'icon': <IconPlayFilled />,
        'disabled': !recorded || saving,
        'onClick': handlePlayPause,
        'aria-label': t('bbm.video.play.start'),
      },
      tooltip: t('bbm.video.play.start'),
    },
    {
      type: 'icon',
      name: 'pause',
      visibility: playing ? 'show' : 'hide',
      props: {
        'icon': <IconPause />,
        'disabled': !recorded || saving,
        'onClick': handlePlayPause,
        'aria-label': t('bbm.video.play.pause'),
      },
      tooltip: t('bbm.video.play.pause'),
    },
    { type: 'divider' },
    {
      type: 'icon',
      name: 'reset',
      props: {
        'icon': <IconRefresh />,
        'disabled': !recorded || saving,
        'onClick': handleReset,
        'aria-label': t('bbm.video.record.reset'),
      },
      tooltip: t('bbm.video.record.reset'),
    },
    {
      type: 'icon',
      name: 'save',
      visibility: hideSaveAction ? 'hide' : 'show',
      props: {
        'icon': <IconSave />,
        'disabled': !recorded || saving || saved,
        'onClick': handleSave,
        'aria-label': t('bbm.video.record.save'),
      },
      tooltip: t('bbm.video.record.save'),
    },
  ];

  return (
    <Toolbar
      items={toolbarItems}
      className="position-absolute bottom-0 start-50 bg-white"
    />
  );
};
