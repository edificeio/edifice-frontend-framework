import { render } from '~/setup';
import Stepper from './Stepper';

describe('Stepper', () => {
  it('renders one step element per nbSteps', () => {
    const { container } = render(<Stepper currentStep={0} nbSteps={4} />);

    expect(container.querySelectorAll('.step')).toHaveLength(4);
  });

  it('marks the currentStep as active', () => {
    const { container } = render(<Stepper currentStep={2} nbSteps={4} />);

    const steps = container.querySelectorAll('.step');
    expect(steps[2]).toHaveClass('step-active', 'bg-secondary');
    expect(steps[0]).not.toHaveClass('step-active');
    expect(steps[0]).toHaveClass('bg-secondary-300');
  });

  it('applies the color prop to the active step', () => {
    const { container } = render(
      <Stepper currentStep={0} nbSteps={2} color="primary" />,
    );

    const steps = container.querySelectorAll('.step');
    expect(steps[0]).toHaveClass('bg-primary', 'step-active');
    expect(steps[1]).toHaveClass('bg-primary-300');
  });

  it('forwards a ref to the underlying container', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Stepper ref={ref} currentStep={0} nbSteps={3} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.querySelectorAll('.step')).toHaveLength(3);
  });
});
