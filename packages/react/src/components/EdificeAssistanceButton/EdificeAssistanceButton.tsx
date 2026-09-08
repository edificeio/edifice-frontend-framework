import { ComponentPropsWithoutRef, forwardRef } from 'react';

import clsx from 'clsx';

import { IconQuestion } from '../../modules/icons/components';
import EdificeMark from './EdificeMark';
import EdificeWordmark from './EdificeWordmark';

export interface EdificeAssistanceButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Show the compact "Edifice" mark instead of the full wordmark. */
  collapsed?: boolean;
}

/**
 * Floating pill button opening the Zendesk assistance widget: the Edifice
 * logo (collapsible to its mark on scroll), a divider, and a help icon.
 */
export const EdificeAssistanceButton = forwardRef<
  HTMLButtonElement,
  EdificeAssistanceButtonProps
>(({ collapsed = false, className, ...restProps }, ref) => (
  <button
    ref={ref}
    type="button"
    className={clsx('edifice-assistance-button', className)}
    {...restProps}
  >
    <span className="edifice-assistance-button-logo">
      {collapsed ? <EdificeMark /> : <EdificeWordmark />}
    </span>
    <span className="edifice-assistance-button-divider" />
    <span className="edifice-assistance-button-question">
      <IconQuestion />
    </span>
  </button>
));

EdificeAssistanceButton.displayName = 'EdificeAssistanceButton';

export default EdificeAssistanceButton;
