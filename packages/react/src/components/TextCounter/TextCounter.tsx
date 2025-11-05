import clsx from 'clsx';

export interface TextcounterProps {
  /**
   * The current number of characters in the text input
   */
  currentLength: number;
  /**
   * The maximum number of characters allowed in the text input
   */
  maxLength: number;
}

const Textcounter = ({ currentLength, maxLength }: TextcounterProps) => {
  return (
    <span
      className={clsx('caption text-end float-end mt-n32 py-2 px-12 ', {
        'text-danger': currentLength === maxLength,
        'text-gray-700': currentLength !== maxLength,
      })}
    >
      {currentLength} / {maxLength}
    </span>
  );
};

Textcounter.displayName = 'Textcounter';

export default Textcounter;
