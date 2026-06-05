import { forwardRef, ReactNode, Ref, useEffect } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useFormControl } from '../Form/FormContext';

export type OmitLabelProps = 'htmlFor';

export interface LabelProps extends Omit<
  React.ComponentPropsWithRef<'label'>,
  OmitLabelProps
> {
  /**
   * Display Icon to the left
   */
  leftIcon?: ReactNode;
  /**
   * Translated Optional Text
   */
  optionalText?: string;
  /**
   * Required Indicator or Text
   */
  requiredText?: string;
  /**
   * Label Text
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const Label = forwardRef(
  (
    {
      leftIcon,
      optionalText,
      requiredText = '*',
      children,
      className,
    }: LabelProps,
    ref?: Ref<HTMLLabelElement>,
  ) => {
    const { id, isOptional, isRequired } = useFormControl();

    const { t } = useTranslation();

    const classes = clsx(
      'form-label',
      {
        'has-icon': leftIcon,
      },
      className,
    );

    const optionalState = isOptional && !isRequired;
    const requiredState = isRequired && !isOptional;

    useEffect(() => {
      if (isOptional && isRequired) {
        throw new Error('Cannot be optional and required at the same time');
      }
    }, [isOptional, isRequired]);

    return (
      <label ref={ref} htmlFor={id} className={classes}>
        {leftIcon}
        {children}
        {optionalState && (
          <em className="optional">
            - {optionalText ?? t('explorer.optional')}
          </em>
        )}
        {requiredState && <em className="required">{requiredText}</em>}
      </label>
    );
  },
);

Label.displayName = 'Label';

export default Label;
