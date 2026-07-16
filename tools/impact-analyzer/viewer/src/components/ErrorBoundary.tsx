import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered in place of children once an error is caught; `reset` clears the boundary so the same children remount. */
  fallback: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches uncaught render errors in its subtree — without this, any bug or
 * malformed data anywhere in the viewer produces a blank white screen
 * (React's default behavior for an error that escapes render), not a
 * message the user can act on.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      'Impact Analyzer viewer crashed:',
      error,
      info.componentStack,
    );
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error) return this.props.fallback(error, this.reset);
    return this.props.children;
  }
}
