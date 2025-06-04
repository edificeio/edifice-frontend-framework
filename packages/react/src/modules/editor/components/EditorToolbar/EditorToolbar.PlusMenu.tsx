import { Fragment } from 'react';

import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownMenuOptions } from '../../../../components';

interface Props {
  /**
   * Options to display
   */
  options: DropdownMenuOptions[];
}

export const EditorToolbarPlusMenu = ({ options }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Dropdown.Trigger
        variant="ghost"
        label={t('tiptap.toolbar.plus')}
        size="md"
        tabIndex={-1}
      />
      <Dropdown.Menu>
        {options.map((option, index) => {
          return (
            <Fragment key={index}>
              {option.type === 'divider' ? (
                <Dropdown.Separator />
              ) : (
                <div onMouseDown={(e) => e.preventDefault()}>
                  <Dropdown.Item
                    icon={option.icon}
                    onClick={() => option.action(null)}
                  >
                    {option.label}
                  </Dropdown.Item>
                </div>
              )}
            </Fragment>
          );
        })}
      </Dropdown.Menu>
    </>
  );
};
