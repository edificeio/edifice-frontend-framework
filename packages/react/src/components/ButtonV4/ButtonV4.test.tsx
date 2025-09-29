import React from 'react';
import { render, screen } from '@testing-library/react';
import { ButtonV4 } from './ButtonV4';
import { MantineProvider } from '../../providers/MantineProvider';

// Wrapper pour les tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('ButtonV4', () => {
  it('renders with default props', () => {
    render(
      <TestWrapper>
        <ButtonV4>Test Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <TestWrapper>
        <ButtonV4 variant="outline">Outline Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByText('Outline Button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ButtonV4 variant="light">Light Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByText('Light Button')).toBeInTheDocument();
  });

  it('renders with different colors', () => {
    const { rerender } = render(
      <TestWrapper>
        <ButtonV4 color="success">Success Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByText('Success Button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ButtonV4 color="danger">Danger Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByText('Danger Button')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <TestWrapper>
        <ButtonV4 size="sm">Small Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByText('Small Button')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <ButtonV4 size="lg">Large Button</ButtonV4>
      </TestWrapper>,
    );

    expect(screen.getByText('Large Button')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(
      <TestWrapper>
        <ButtonV4 loading>Loading Button</ButtonV4>
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles disabled state', () => {
    render(
      <TestWrapper>
        <ButtonV4 disabled>Disabled Button</ButtonV4>
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();

    render(
      <TestWrapper>
        <ButtonV4 onClick={handleClick}>Clickable Button</ButtonV4>
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(
      <TestWrapper>
        <ButtonV4 className="custom-class">Custom Button</ButtonV4>
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('edifice-button-v4');
  });
});
