import clsx from 'clsx';
import { Flex } from '../Flex';
import Radio from '../Radio/Radio';
import { useRadioCardContext } from './RadioCardContext';

/**
 * RadioCard title component.
 * Displays the title of the RadioCard,
 * alongside a radio button if the hideRadioButton prop is false.
 *
 * @example
 * <RadioCard.Title>Le Titre de la Radio Card</RadioCard.Title>
 */
const RadioCardTitle = ({ children }: { children: React.ReactNode }) => {
  const { value, model, groupName, isSelected, onChange, hideRadioButton } =
    useRadioCardContext();

  return (
    <Flex justify="between" className="px-24">
      <h4 className="mb-8" id={`radio-card-label-${value}`}>
        {children}
      </h4>
      <Radio
        model={model}
        name={groupName}
        value={value}
        checked={isSelected}
        onChange={onChange}
        aria-labelledby={`radio-card-label-${value}`}
        className={clsx({ 'd-none': hideRadioButton })}
      />
    </Flex>
  );
};

export default RadioCardTitle;
