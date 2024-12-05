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
  IconMic,
  IconMicOff,
  IconTextToSpeech,
  IconTextToSpeechOff,
  IconWand,
} from '../../../icons/components';
import { useEditorContext } from '../../hooks';
import { useCantooEditor } from '../../hooks/useCantooEditor';
interface Props {
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
  openCantooAdaptTextBox: () => void;
  isCantooAdaptTextBoxOpen: boolean;
}
export const EditorToolbarCantoo = ({
  triggerProps,
  openCantooAdaptTextBox,
  isCantooAdaptTextBoxOpen,
}: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();
  const {
    speech2textIsActive,
    text2speechIsActive,
    toggleSpeech2Text,
    toggleText2Speech,
  } = useCantooEditor(editor);
  const cantooOptions = [
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
      id: 'formatText',
      label: t('tiptap.toolbar.cantoo.formatText'),
      className: isCantooAdaptTextBoxOpen ? 'fw-bold' : '',
      icon: <IconWand />,
      action: () => openCantooAdaptTextBox(),
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
            isCantooAdaptTextBoxOpen
              ? 'is-selected'
              : ''
          }
          aria-label={t('tiptap.toolbar.cantoo.choice')}
        />
      </Tooltip>
      <Dropdown.Menu>
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
