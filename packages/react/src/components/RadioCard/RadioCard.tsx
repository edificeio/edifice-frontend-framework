import { ChangeEvent, forwardRef, Ref } from 'react';

import clsx from 'clsx';
import { Flex } from '../Flex';
import Radio from '../Radio/Radio';

export interface RadioCardProps {
  /**
   * The currently selected value in the radio group.
   */
  selectedValue: string;
  /**
   * The value associated with this specific radio card.
   */
  value: string;
  /**
   * The main label text for the radio card.
   */
  label: string;
  /**
   * Callback function triggered when the radio card selection changes.
   */

  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Optional additional CSS class names to apply to the radio card.
   */
  className?: string;
  /**
   * Optional description text displayed below the label.
   */
  description?: string;
  /**
   * Optional model value associated with the radio card, can be a string, boolean, or number.
   */
  model?: string | boolean | number;
  /**
   * Optional name for the radio group, used to group radio cards together.
   */
  groupName?: string;
}

const RadioCard = forwardRef(
  (
    {
      selectedValue,
      value,
      onChange,
      description,
      label,
      model = '',
      groupName = 'group',
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

    return (
      <label
        ref={ref}
        role="button"
        tabIndex={0}
        className={clsx(
          'border py-24 border-2 rounded-3',
          isSelected && 'border-secondary',
          !isSelected && 'border-light',
          restProps.className,
        )}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        <Flex justify="between" className="px-24">
          <h4 className="mb-8" id={`radio-card-label-${value}`}>
            {label}
          </h4>
          <Radio
            model={model}
            name={groupName}
            value={value}
            checked={isSelected}
            onChange={onChange}
            aria-labelledby={`radio-card-label-${value}`}
          />
        </Flex>
        {description && (
          <p
            id={`radio-card-description-${value}`}
            className="px-24 text-gray-700 pe-32"
          >
            {description}
          </p>
        )}
      </label>
    );
  },
);

RadioCard.displayName = 'RadioCard';

export default RadioCard;
