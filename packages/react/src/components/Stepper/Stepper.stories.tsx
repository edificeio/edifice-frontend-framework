import type { Meta, StoryObj } from '@storybook/react';
import Stepper, { StepperProps } from './Stepper';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { useState } from 'react';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  args: {
    currentStep: 0,
    nbSteps: 3,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Stepper component for displaying a step-by-step process. Supports customizable steps, active step indication, and transition animations.',
      },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: StepperProps) => {
    const [currentStep, setCurrentStep] = useState(args.currentStep);

    const handlePrev = () => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
      setCurrentStep((prev) => Math.min(prev + 1, args.nbSteps - 1));
    };

    return (
      <>
        <Stepper {...args} currentStep={currentStep} />
        <Flex gap="4" className="mt-16">
          <Button size="sm" onClick={handlePrev} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button
            size="sm"
            onClick={handleNext}
            disabled={currentStep === args.nbSteps - 1}
          >
            Next
          </Button>
          <div className="coucou"></div>
        </Flex>
      </>
    );
  },
};
