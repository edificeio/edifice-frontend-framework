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
import { useEditorContext } from '../../hooks';
import { useCantooEditor } from '../../hooks/useCantooEditor';
import { useEdificeClient } from 'src/providers';
interface Props {
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
  handleOpenCantooAdaptTextBox: (position: string) => void;
  cantooAdaptTextBoxOpenPosition: {
    right: boolean;
    bottom: boolean;
  };
}
export const EditorToolbarCantoo = ({
  triggerProps,
  handleOpenCantooAdaptTextBox,
  cantooAdaptTextBoxOpenPosition,
}: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();
  const { appCode } = useEdificeClient();

  const {
    speech2textIsActive,
    text2speechIsActive,
    toggleSpeech2Text,
    toggleText2Speech,
    toogleSettings,
  } = useCantooEditor(editor);

  const cantooOptionsAdaptText = [
    {
      id: 'right',
      label: t('tiptap.toolbar.cantoo.formatText.show.on.right'),
      icon: <IconDeleteColumnHighlight />,
      className: cantooAdaptTextBoxOpenPosition.right ? 'fw-bold' : '',
      action: () => handleOpenCantooAdaptTextBox('right'),
    },
    {
      id: 'bottom',
      label: t('tiptap.toolbar.cantoo.formatText.show.on.bottom'),
      icon: <IconDeleteRowHighlight />,
      className: cantooAdaptTextBoxOpenPosition.bottom ? 'fw-bold' : '',
      action: () => handleOpenCantooAdaptTextBox('bottom'),
    },
  ];

  const cantooOptions =
    appCode === 'collaborativewall'
      ? [
          {
            id: 'formatText',
            label: t('tiptap.toolbar.cantoo.formatText'),
            className: cantooAdaptTextBoxOpenPosition.bottom ? 'fw-bold' : '',
            icon: <IconWand />,
            action: () => handleOpenCantooAdaptTextBox('bottom'),
          },
          {
            id: 'speech2text',
            label: t('tiptap.toolbar.cantoo.speech2text'),
            className: speech2textIsActive ? 'fw-bold' : '',
            icon: speech2textIsActive ? <IconMicOff /> : <IconMic />,
            action: () => toggleSpeech2Text(),
          },
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
        ]
      : [
          {
            id: 'speech2text',
            label: t('tiptap.toolbar.cantoo.speech2text'),
            className: speech2textIsActive ? 'fw-bold' : '',
            icon: speech2textIsActive ? <IconMicOff /> : <IconMic />,
            action: () => toggleSpeech2Text(),
          },
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
          {
            id: 'settings',
            label: t('tiptap.toolbar.cantoo.settings'),
            icon: <IconSettings />,
            action: () => toogleSettings(),
          },
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
            cantooAdaptTextBoxOpenPosition.right ||
            cantooAdaptTextBoxOpenPosition.bottom
              ? 'is-selected'
              : ''
          }
          aria-label={t('tiptap.toolbar.cantoo.choice')}
        />
      </Tooltip>
      <Dropdown.Menu>
        {appCode != 'collaborativewall' && (
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
