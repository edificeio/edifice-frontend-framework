import { Fragment, RefAttributes } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Dropdown,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '../../../../components';
import { IconTextSize } from '../../../icons/components';
import { useEditorContext } from '../../hooks/useEditorContext';
import { hasExtension } from '../../utilities/has-extension';

interface Props {
  /**
   * Props for the trigger
   */
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
}

export const EditorToolbarTextSize = ({ triggerProps }: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();

  const textOptions = [
    {
      id: 'title-1',
      label: t('tiptap.toolbar.size.h1'),
      className: 'fs-2 fw-bold text-secondary',
      action: () =>
        editor
          ?.chain()
          .focus()
          .scrollIntoView()
          .setCustomHeading({ level: 1 })
          .run(),
      visibility: hasExtension('customHeading', editor),
    },
    {
      id: 'title-2',
      label: t('tiptap.toolbar.size.h2'),
      className: 'fs-3 fw-bold text-secondary',
      action: () =>
        editor?.chain().focus().setCustomHeading({ level: 2 }).run(),
      visibility: hasExtension('customHeading', editor),
    },
    {
      id: 'divider',
      type: 'divider',
      visibility:
        hasExtension('customHeading', editor) &&
        hasExtension('fontSize', editor),
    },
    {
      id: 'big-text',
      label: t('tiptap.toolbar.size.big'),
      className: 'fs-4',
      action: () =>
        editor?.chain().focus().setParagraph().setFontSize('18px').run(),
      visibility: hasExtension('fontSize', editor),
    },
    {
      id: 'normal-text',
      label: t('tiptap.toolbar.size.normal'),
      action: () =>
        editor?.chain().focus().setParagraph().setFontSize('16px').run(),
      visibility: hasExtension('fontSize', editor),
    },
    {
      id: 'small-text',
      label: t('tiptap.toolbar.size.small'),
      className: 'fs-6',
      action: () =>
        editor?.chain().focus().setParagraph().setFontSize('14px').run(),
      visibility: hasExtension('fontSize', editor),
    },
  ];

  return (
    <>
      <Tooltip message={t('tiptap.toolbar.size.choice')} placement="top">
        <IconButton
          {...triggerProps}
          type="button"
          variant="ghost"
          color="tertiary"
          icon={<IconTextSize />}
          aria-label={t('tiptap.toolbar.size.choice')}
        />
      </Tooltip>
      <Dropdown.Menu>
        {textOptions.map((option) => {
          return (
            <Fragment key={option.id}>
              {option.type === 'divider' && option.visibility ? (
                <Dropdown.Separator />
              ) : option.visibility ? (
                <div onMouseDown={(e) => e.preventDefault()}>
                  <Dropdown.Item onClick={option.action}>
                    <span className={option.className}>{option.label}</span>
                  </Dropdown.Item>
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </Dropdown.Menu>
    </>
  );
};
