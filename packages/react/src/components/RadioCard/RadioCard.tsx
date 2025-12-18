import { ChangeEvent, forwardRef, Ref, useMemo } from 'react';

import clsx from 'clsx';
import { RadioCardContext } from './RadioCardContext';
import RadioCardTitle from './RadioCardTitle';
import RadioCardContent from './RadioCardContent';

export interface RadioCardProps {
  /**
   * The currently selected value in the radio group.
   */
  selectedValue: string;

  /**
   * The value associated with this specific radio card.
   */
  value: string;

  /* Children Node */
  children: React.ReactNode;

  /**
   * Callback function triggered when the radio card selection changes.
   */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Optional additional CSS class names to apply to the radio card.
   */
  className?: string;

  /**
   * Optional model value associated with the radio card, can be a string, boolean, or number.
   */
  model?: string | boolean | number;

  /**
   * Optional name for the radio group, used to group radio cards together.
   */
  groupName?: string;

  /**
   * Optional hide Radio Button
   */
  hideRadioButton?: boolean;
}

const Root = forwardRef(
  (
    {
      selectedValue,
      value,
      onChange,
      children,
      model = '',
      groupName = 'group',
      hideRadioButton = false,
      ...restProps
    }: RadioCardProps,
    ref: Ref<HTMLLabelElement>,
  ) => {
    const isSelected = selectedValue === value;

    // Handle keyboard interaction for accessibility
    const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
      if (event.key === 'Enter') {
        const inputElement = event.currentTarget.querySelector(
          'input[type="radio"]',
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.click();
        }
      }
    };

    const values = useMemo(
      () => ({
        value,
        model,
        groupName,
        isSelected,
        onChange,
        hideRadioButton,
      }),
      [value, model, groupName, isSelected, onChange, hideRadioButton],
    );

    return (
      <RadioCardContext.Provider value={values}>
        <label
          ref={ref}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          {...restProps}
          className={clsx(
            'border py-24 border-2 rounded-3',
            isSelected && 'border-secondary',
            !isSelected && 'border-light',
            restProps.className,
          )}
        >
          {children}
        </label>
      </RadioCardContext.Provider>
    );
  },
);

Root.displayName = 'RadioCard';

const RadioCard = Object.assign(Root, {
  Title: RadioCardTitle,
  Content: RadioCardContent,
});

export default RadioCard;
