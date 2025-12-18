import { useRadioCardContext } from './RadioCardContext';

/**
 * RadioCard content component.
 * @param param0 RadioCard Content
 *
 * @example
 * <RadioCard.Content>
 *   This is the content of the Radio Card.
 * </RadioCard.Content>
 */
const RadioCardContent = ({ children }: { children: React.ReactNode }) => {
  const { value } = useRadioCardContext();

  return <div id={`radio-card-content-${value}`}>{children}</div>;
};

export default RadioCardContent;
