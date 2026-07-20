import { createRef } from 'react';
import { render, screen } from '~/setup';
import { describe, expect, it } from 'vitest';
import Heading from './Heading';

describe('Heading', () => {
  it('renders an h1 element by default', () => {
    render(<Heading>Title</Heading>);
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H1');
  });

  it('applies the h1 headingStyle class by default', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByText('Title')).toHaveClass('h1');
  });

  it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
    'renders a %s element',
    (level) => {
      render(<Heading level={level}>Title</Heading>);
      expect(screen.getByText('Title').tagName).toBe(level.toUpperCase());
    },
  );

  it('applies the headingStyle class independently from the level', () => {
    render(
      <Heading level="h3" headingStyle="h1">
        Title
      </Heading>,
    );
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H3');
    expect(el).toHaveClass('h1');
  });

  it('merges a custom className with the headingStyle class', () => {
    render(<Heading className="custom-class">Title</Heading>);
    const el = screen.getByText('Title');
    expect(el).toHaveClass('h1', 'custom-class');
  });

  it('renders children correctly', () => {
    render(
      <Heading>
        <span>Nested</span>
      </Heading>,
    );
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('forwards a ref to the underlying heading element', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>Title</Heading>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('H1');
  });

  it('passes additional HTML attributes to the heading element', () => {
    render(
      <Heading data-testid="heading" aria-label="section title">
        Title
      </Heading>,
    );
    const el = screen.getByTestId('heading');
    expect(el).toHaveAttribute('aria-label', 'section title');
  });
});
