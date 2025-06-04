import { Fragment, RefAttributes, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Dropdown,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '../../../../components';
import { IconTextTypo } from '../../../icons/components';
import { useEditorContext } from '../../hooks/useEditorContext';

interface Props {
  /**
   * Props for the trigger
   */
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
}

export const EditorToolbarTypography = ({ triggerProps }: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();

  const [value, setValue] = useState<string>('sans-serif');

  useEffect(() => {
    // When cursor moves in editor, update the actual text typo.
    const textStyle = editor?.getAttributes('textStyle');
    setValue(textStyle?.fontFamily ?? '');
  }, [editor, editor?.state]);

  const options = [
    {
      value: '',
      label: t('tiptap.toolbar.typo.sans'),
    },
    {
      value: 'Lora',
      label: t('tiptap.toolbar.typo.serif'),
      className: 'ff-serif',
    },
    {
      value: 'IBM Plex Mono',
      label: t('tiptap.toolbar.typo.mono'),
      className: 'ff-script',
    },
    {
      value: 'Ecriture A',
      label: t('tiptap.toolbar.typo.cursive'),
      className: 'ff-cursive',
    },
    {
      value: 'OpenDyslexic',
      label: t('tiptap.toolbar.typo.dyslexic'),
      className: 'ff-dyslexic',
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.toolbar.typo.choice')} placement="top">
        <IconButton
          {...triggerProps}
          type="button"
          variant="ghost"
          color="tertiary"
          icon={<IconTextTypo />}
          aria-label={t('tiptap.toolbar.typo.choice')}
          className={
            editor?.isActive('textStyle', {
              color: /^#([0-9a-f]{3}){1,2}$/i,
            })
              ? 'selected'
              : ''
          }
        />
      </Tooltip>
      <Dropdown.Menu>
        {options.map((option) => {
          return (
            <Fragment key={option.label}>
              <div onMouseDown={(e) => e.preventDefault()}>
                <Dropdown.RadioItem
                  value={option.value}
                  model={value}
                  onChange={(value: string) => {
                    if (typeof value === 'string' && value.length > 0) {
                      editor?.chain().focus().setFontFamily(value).run();
                      setValue(value);
                    } else {
                      editor?.chain().focus().unsetFontFamily().run();
                      setValue('');
                    }
                  }}
                >
                  <span className={option.className}>{option.label}</span>
                </Dropdown.RadioItem>
              </div>
            </Fragment>
          );
        })}
      </Dropdown.Menu>
    </>
  );
};
