import { createRef } from 'react';
import { render, screen } from '~/setup';
import VisuallyHidden from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children content', () => {
    render(<VisuallyHidden>Accessible text</VisuallyHidden>);

    expect(screen.getByText('Accessible text')).toBeInTheDocument();
  });

  it('applies the visually-hidden class on the span', () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);

    expect(screen.getByText('Hidden label')).toHaveClass('visually-hidden');
  });

  it('forwards the ref to the underlying span element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<VisuallyHidden ref={ref}>Ref target</VisuallyHidden>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toBe(screen.getByText('Ref target'));
  });
});
