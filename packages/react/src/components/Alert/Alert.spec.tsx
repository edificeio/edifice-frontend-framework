import { createRef } from 'react';

import { act, render, screen } from '~/setup';
import Alert, { AlertRef } from './Alert';

describe('Alert component', () => {
  it('renders its content and is visible by default', () => {
    render(<Alert>Hello</Alert>);
    const alert = screen.getByRole('alert');

    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies the success modifier class by default', () => {
    render(<Alert>Hello</Alert>);

    expect(screen.getByRole('alert')).toHaveClass('alert-success');
  });

  it.each([
    ['warning', 'alert-warning'],
    ['info', 'alert-info'],
    ['danger', 'alert-danger'],
  ] as const)('maps the "%s" type to "%s"', (type, expectedClass) => {
    render(<Alert type={type}>Hello</Alert>);

    expect(screen.getByRole('alert')).toHaveClass(expectedClass);
  });

  it('applies toast and position modifier classes', () => {
    render(
      <Alert isToast position="top-right">
        Hello
      </Alert>,
    );
    const alert = screen.getByRole('alert');

    expect(alert).toHaveClass('is-toast');
    expect(alert).toHaveClass('top-right');
  });

  it('renders a dismiss button when dismissible and hides on click', async () => {
    const onClose = vi.fn();
    const { user } = render(
      <Alert isDismissible onClose={onClose}>
        Hello
      </Alert>,
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('does not render a dismiss button when not dismissible', () => {
    render(<Alert>Hello</Alert>);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('notifies visibility changes through onVisibilityChange', async () => {
    const onVisibilityChange = vi.fn();
    const { user } = render(
      <Alert isDismissible onVisibilityChange={onVisibilityChange}>
        Hello
      </Alert>,
    );

    expect(onVisibilityChange).toHaveBeenLastCalledWith(true);

    await user.click(screen.getByRole('button'));

    expect(onVisibilityChange).toHaveBeenLastCalledWith(false);
  });

  it('exposes imperative show/hide handlers through the ref', () => {
    const ref = createRef<AlertRef>();
    render(
      <Alert ref={ref} isDismissible>
        Hello
      </Alert>,
    );

    expect(typeof ref.current?.show).toBe('function');
    expect(typeof ref.current?.hide).toBe('function');
  });

  it('auto-closes after the configured delay', () => {
    vi.useFakeTimers();
    try {
      const onClose = vi.fn();
      render(
        <Alert autoClose autoCloseDelay={3000} onClose={onClose}>
          Hello
        </Alert>,
      );

      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
