import { ReactNode } from 'react';

import clsx from 'clsx';

import { IconError, IconSuccessOutline } from '../../modules/icons/components';
import { useFormControl } from './FormContext';

const FormText = ({ children }: { children: ReactNode }) => {
  const { status } = useFormControl();
  const classes = clsx('input-message', {
    'input-message--invalid': status === 'invalid',
    'input-message--valid': status === 'valid',
  });
  const Icon =
    status === 'invalid'
      ? IconError
      : status === 'valid'
        ? IconSuccessOutline
        : null;

  return (
    <p className={classes}>
      {Icon && <Icon className="input-message__icon" aria-hidden="true" />}
      {children}
    </p>
  );
};

FormText.displayName = 'Text';

export default FormText;
