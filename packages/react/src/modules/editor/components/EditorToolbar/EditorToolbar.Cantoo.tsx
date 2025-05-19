import { Fragment, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '../../../../components';
import {
  IconCantoo,
  IconDeleteColumnHighlight,
  IconDeleteRowHighlight,
  IconMic,
  IconMicOff,
  IconSettings,
  IconTextToSpeech,
  IconTextToSpeechOff,
  IconWand,
} from '../../../icons/components';
import { CantooEditor } from '../../hooks';
interface Props {
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
  cantooEditor: CantooEditor;
}
export const EditorToolbarCantoo = ({ triggerProps, cantooEditor }: Props) => {
  const { t } = useTranslation();

  const {
    speech2textIsAvailable,
    speech2textIsActive,
    text2speechIsActive,
    toggleSpeech2Text,
    toggleText2Speech,
    toogleSettings,
    cantooParam,
  } = cantooEditor;

  const cantooOptionsAdaptText = [
    {
      id: 'right',
      label: t('tiptap.toolbar.cantoo.formatText.show.on.right'),
      icon: <IconDeleteColumnHighlight />,
      className: cantooEditor.openPositionAdaptText.right ? 'fw-bold' : '',
      action: () => cantooEditor.handleCantooAdaptTextPosition('right'),
    },
    {
      id: 'bottom',
      label: t('tiptap.toolbar.cantoo.formatText.show.on.bottom'),
      icon: <IconDeleteRowHighlight />,
      className: cantooEditor.openPositionAdaptText.bottom ? 'fw-bold' : '',
      action: () => cantooEditor.handleCantooAdaptTextPosition('bottom'),
    },
  ];

  const cantooOptions = [
    ...(cantooParam === 'simplify'
      ? [
          {
            id: 'formatText',
            label: t('tiptap.toolbar.cantoo.formatText'),
            className: cantooEditor.openPositionAdaptText.bottom
              ? 'fw-bold'
              : '',
            icon: <IconWand />,
            action: () => cantooEditor.handleCantooAdaptTextPosition('bottom'),
          },
        ]
      : []),
    ...(speech2textIsAvailable
      ? [
          {
            id: 'speech2text',
            label: t('tiptap.toolbar.cantoo.speech2text'),
            className: speech2textIsActive ? 'fw-bold' : '',
            icon: speech2textIsActive ? <IconMicOff /> : <IconMic />,
            action: () => toggleSpeech2Text(),
          },
        ]
      : []),
    {
      id: 'text2speech',
      label: t('tiptap.toolbar.cantoo.text2speech'),
      className: text2speechIsActive ? 'fw-bold' : '',
      icon: text2speechIsActive ? (
        <IconTextToSpeechOff />
      ) : (
        <IconTextToSpeech />
      ),
      action: () => toggleText2Speech(),
    },
    ...(cantooParam === 'simplify'
      ? []
      : [
          {
            id: 'settings',
            label: t('tiptap.toolbar.cantoo.settings'),
            icon: <IconSettings />,
            action: () => toogleSettings(),
          },
        ]),
  ];
  return (
    <>
      <Tooltip message={t('tiptap.toolbar.cantoo.choice')} placement={'top'}>
        <IconButton
          {...triggerProps}
          type={'button'}
          variant={'ghost'}
          color={'tertiary'}
          icon={<IconCantoo />}
          className={
            speech2textIsActive ||
            text2speechIsActive ||
            cantooEditor.openPositionAdaptText.right ||
            cantooEditor.openPositionAdaptText.bottom
              ? 'is-selected'
              : ''
          }
          aria-label={t('tiptap.toolbar.cantoo.choice')}
          isLoading={(window as any).Cantoo ? false : true}
        />
      </Tooltip>
      <Dropdown.Menu>
        {cantooParam != 'simplify' && (
          <>
            <Dropdown.MenuGroup label={t('tiptap.toolbar.cantoo.formatText')}>
              {cantooOptionsAdaptText.map((option) => {
                return (
                  <Fragment key={option.id}>
                    <Dropdown.Item
                      onClick={option.action}
                      icon={option.icon}
                      className={option.className}
                    >
                      <span>{option.label}</span>
                    </Dropdown.Item>
                  </Fragment>
                );
              })}
            </Dropdown.MenuGroup>
            <Dropdown.Separator />
          </>
        )}
        {cantooOptions.map((option) => {
          return (
            <Fragment key={option.id}>
              <Dropdown.Item onClick={option.action} icon={option.icon}>
                <span className={option.className}>{option.label}</span>
              </Dropdown.Item>
            </Fragment>
          );
        })}
      </Dropdown.Menu>
    </>
  );
};
