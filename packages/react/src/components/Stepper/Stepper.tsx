import { forwardRef, Ref } from 'react';
import { Flex } from '../Flex';

export type StepperColors = 'primary' | 'secondary';

export interface StepperProps {
  /**
   * Index of the currently active step in the Stepper.
   */
  currentStep: number;
  /**
   * Number of steps in the Stepper.
   */
  nbSteps: number;
  /**
   * Gap between steps in the Stepper.
   */
  gap?: '4' | '8' | '12' | '16' | '24' | '32';
}

const Stepper = forwardRef(
  (
    { currentStep, nbSteps, gap = '8', ...props }: StepperProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <Flex gap={gap} ref={ref} {...props}>
        {Array.from({ length: nbSteps }).map((_, index) => (
          <div
            key={`step-${index}`}
            className={`rounded step ${index === currentStep ? 'bg-secondary step-active' : 'bg-secondary-300'}`}
          />
        ))}
      </Flex>
    );
  },
);

Stepper.displayName = 'Stepper';

export default Stepper;
