import { createRef } from 'react';

import { act, fireEvent, render, screen, waitFor } from '~/setup';
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

  it('renders the progress bar only for an auto-closing, non-dismissible toast', () => {
    const { rerender } = render(
      <Alert isToast autoClose>
        Hello
      </Alert>,
    );
    expect(document.querySelector('.alert-progress')).toBeInTheDocument();

    rerender(
      <Alert isToast autoClose isDismissible>
        Hello
      </Alert>,
    );
    expect(document.querySelector('.alert-progress')).toBeNull();

    rerender(<Alert autoClose>Hello</Alert>);
    expect(document.querySelector('.alert-progress')).toBeNull();

    rerender(<Alert isToast>Hello</Alert>);
    expect(document.querySelector('.alert-progress')).toBeNull();
  });

  it('pauses the auto-close timer on hover and resumes on mouse leave', () => {
    vi.useFakeTimers();
    try {
      const onClose = vi.fn();
      render(
        <Alert isToast autoClose autoCloseDelay={3000} onClose={onClose}>
          Hello
        </Alert>,
      );
      const alert = screen.getByRole('alert');

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      fireEvent.mouseEnter(alert);
      expect(alert.querySelector('.alert-progress')).toHaveClass('is-paused');

      // Waiting past the original delay has no effect while paused
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.mouseLeave(alert);
      expect(alert.querySelector('.alert-progress')).not.toHaveClass(
        'is-paused',
      );

      // Only the remaining ~1000ms should be left after the pause
      act(() => {
        vi.advanceTimersByTime(999);
      });
      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      // The toast then plays its exit animation before onClose actually fires
      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(240);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('dismisses a toast when clicked', async () => {
    const onClose = vi.fn();
    const { user } = render(
      <Alert isToast onClose={onClose}>
        Hello
      </Alert>,
    );

    await user.click(screen.getByRole('alert'));
    // The toast stays mounted during its exit animation
    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('does not dismiss a static alert when clicked', async () => {
    const onClose = vi.fn();
    const { user } = render(<Alert onClose={onClose}>Hello</Alert>);

    await user.click(screen.getByRole('alert'));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not dismiss the toast when clicking its action button', async () => {
    const onClose = vi.fn();
    const { user } = render(
      <Alert
        isToast
        onClose={onClose}
        button={<button type="button">Undo</button>}
      >
        Hello
      </Alert>,
    );

    await user.click(screen.getByRole('button', { name: 'Undo' }));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('plays the entrance animation, not the exit one, when re-shown after closing', async () => {
    const ref = createRef<AlertRef>();
    const { user } = render(
      <Alert ref={ref} isToast position="top-right">
        Hello
      </Alert>,
    );

    await user.click(screen.getByRole('alert'));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());

    act(() => {
      ref.current?.show();
    });

    expect(screen.getByRole('alert')).toHaveClass('alert-slide-in-right');
  });
});
