import { createRef, useEffect } from 'react';

import { act, render, screen } from '~/setup';
import OnboardingModal, {
  OnboardingModalRef,
  OnboardingProps,
} from './OnboardingModal';

/**
 * The real `useOnboardingModal` hook drives its state through an async
 * preference-loading effect. Exercising that through a full Swiper render
 * would add unnecessary coupling to this component-level spec, so the whole
 * module is mocked and reconfigured per test via `mockReturnValue`.
 */
const { useOnboardingModalMock, mockSetIsOpen, mockHandleSavePreference } =
  vi.hoisted(() => ({
    useOnboardingModalMock: vi.fn(),
    mockSetIsOpen: vi.fn(),
    mockHandleSavePreference: vi.fn(),
  }));

vi.mock('./useOnboardingModal', () => ({
  useOnboardingModal: useOnboardingModalMock,
}));

/**
 * `swiper`/`swiper/react` performs real DOM measurements (ResizeObserver,
 * canvas...) that jsdom does not provide. No existing spec in the repo
 * imports from `swiper`, so it is mocked here with a minimal stand-in that
 * only exposes the pieces OnboardingModal.tsx relies on: an `onSwiper`
 * callback fired once with a fake swiper instance, and an `onSlideChange`
 * callback the tests can trigger to simulate carousel progress.
 */
const {
  mockSwiperInstance,
  registerSlideChangeHandler,
  triggerSlideChange,
  setActiveIndex,
} = vi.hoisted(() => {
  const instance = {
    activeIndex: 0,
    progress: 0,
    slidePrev: vi.fn(),
    slideNext: vi.fn(),
  };
  let slideChangeHandler: ((swiper: { progress: number }) => void) | null =
    null;

  return {
    mockSwiperInstance: instance,
    // Called by the mocked <Swiper> to register the latest onSlideChange.
    registerSlideChangeHandler: (
      handler: (swiper: { progress: number }) => void,
    ) => {
      slideChangeHandler = handler;
    },
    // Used by tests to simulate the user moving the carousel.
    triggerSlideChange: (progress: number) => {
      instance.progress = progress;
      slideChangeHandler?.({ progress });
    },
    setActiveIndex: (index: number) => {
      instance.activeIndex = index;
    },
  };
});

vi.mock('swiper/react', () => ({
  Swiper: ({
    children,
    onSwiper,
    onSlideChange,
  }: {
    children: React.ReactNode;
    onSwiper?: (swiper: typeof mockSwiperInstance) => void;
    onSlideChange?: (swiper: { progress: number }) => void;
  }) => {
    // Register the handler so tests can trigger it through
    // `triggerSlideChange`, then hand the fake instance to the component
    // after mount, exactly like the real Swiper does (calling onSwiper
    // synchronously during render would update the parent while it is
    // rendering a child, which React warns about).
    if (onSlideChange) {
      registerSlideChangeHandler(onSlideChange);
    }
    useEffect(() => {
      onSwiper?.(mockSwiperInstance);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div data-testid="mock-swiper">{children}</div>;
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-swiper-slide">{children}</div>
  ),
}));

vi.mock('swiper/modules', () => ({
  Pagination: {},
}));

function makeItems(count: 1 | 2) {
  const items: OnboardingProps['items'] = [
    { src: 'illu-1.svg', alt: 'alt-1', text: 'text-1' },
  ];
  if (count === 2) {
    items.push({ src: 'illu-2.svg', alt: 'alt-2', text: 'text-2' });
  }
  return items;
}

function setHook(overrides: {
  isOpen?: boolean;
  isOnboarding?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  handleSavePreference?: () => void;
}) {
  useOnboardingModalMock.mockReturnValue({
    isOpen: overrides.isOpen ?? true,
    isOnboarding: overrides.isOnboarding ?? false,
    setIsOpen: overrides.setIsOpen ?? mockSetIsOpen,
    handleSavePreference:
      overrides.handleSavePreference ?? mockHandleSavePreference,
  });
}

describe('OnboardingModal', () => {
  beforeEach(() => {
    mockSwiperInstance.activeIndex = 0;
    mockSwiperInstance.progress = 0;
    setHook({});
  });

  it('renders nothing when isOpen is false', () => {
    setHook({ isOpen: false });

    render(<OnboardingModal id="onboarding-id" items={makeItems(1)} />);

    expect(screen.queryByTestId('modal-onboarding')).not.toBeInTheDocument();
  });

  it('renders the default fallback title when no override is provided', () => {
    setHook({ isOpen: true });

    render(<OnboardingModal id="onboarding-id" items={makeItems(1)} />);

    expect(screen.getByTestId('modal-onboarding')).toBeInTheDocument();
    expect(
      screen.getByText('explorer.modal.onboarding.trash.title'),
    ).toBeInTheDocument();
  });

  it('renders the modalOptions.title override when provided', () => {
    setHook({ isOpen: true });

    render(
      <OnboardingModal
        id="onboarding-id"
        items={makeItems(1)}
        modalOptions={{ title: 'custom.modal.title' }}
      />,
    );

    expect(screen.getByText('custom.modal.title')).toBeInTheDocument();
  });

  it('renders the active slide item.title override when the active slide has one', () => {
    setHook({ isOpen: true });
    setActiveIndex(1);

    render(
      <OnboardingModal
        id="onboarding-id"
        items={[
          { src: 'illu-1.svg', alt: 'alt-1', text: 'text-1' },
          {
            src: 'illu-2.svg',
            alt: 'alt-2',
            text: 'text-2',
            title: 'slide-2.title',
          },
        ]}
        modalOptions={{ title: 'custom.modal.title' }}
      />,
    );

    expect(screen.getByText('slide-2.title')).toBeInTheDocument();
    expect(screen.queryByText('custom.modal.title')).not.toBeInTheDocument();
  });

  it('exposes the imperative handle from the (mocked) hook via ref', () => {
    setHook({ isOpen: true });
    const ref = createRef<OnboardingModalRef>();

    render(
      <OnboardingModal ref={ref} id="onboarding-id" items={makeItems(1)} />,
    );

    expect(ref.current?.setIsOpen).toBe(mockSetIsOpen);
    expect(ref.current?.handleSavePreference).toBe(mockHandleSavePreference);

    ref.current?.setIsOpen(true);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);

    ref.current?.handleSavePreference();
    expect(mockHandleSavePreference).toHaveBeenCalled();
  });

  it('calls isOnboardingChange with the hook value on mount', () => {
    setHook({ isOpen: true, isOnboarding: true });
    const isOnboardingChange = vi.fn();

    render(
      <OnboardingModal
        id="onboarding-id"
        items={makeItems(1)}
        isOnboardingChange={isOnboardingChange}
      />,
    );

    expect(isOnboardingChange).toHaveBeenCalledWith(true);
  });

  it('calls isOnboardingChange again when the hook value changes across renders', () => {
    setHook({ isOpen: true, isOnboarding: false });
    const isOnboardingChange = vi.fn();

    const { rerender } = render(
      <OnboardingModal
        id="onboarding-id"
        items={makeItems(1)}
        isOnboardingChange={isOnboardingChange}
      />,
    );

    expect(isOnboardingChange).toHaveBeenLastCalledWith(false);

    setHook({ isOpen: true, isOnboarding: true });
    rerender(
      <OnboardingModal
        id="onboarding-id"
        items={makeItems(1)}
        isOnboardingChange={isOnboardingChange}
      />,
    );

    expect(isOnboardingChange).toHaveBeenLastCalledWith(true);
  });

  it('always renders the later button and closes without saving a preference on click', async () => {
    setHook({ isOpen: true, isOnboarding: true });

    const { user } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(1)} />,
    );

    const laterButton = screen.getByTestId('modal-onboarding-later');
    expect(laterButton).toBeInTheDocument();

    await user.click(laterButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockHandleSavePreference).not.toHaveBeenCalled();
  });

  it('hides the previous button while progress is 0 and shows it once progress moves past 0', () => {
    setHook({ isOpen: true });

    render(<OnboardingModal id="onboarding-id" items={makeItems(2)} />);

    expect(
      screen.queryByTestId('modal-onboarding-previous'),
    ).not.toBeInTheDocument();

    act(() => {
      triggerSlideChange(0.5);
    });

    expect(screen.getByTestId('modal-onboarding-previous')).toBeInTheDocument();
  });

  it('calls swiperInstance.slidePrev when the previous button is clicked', async () => {
    setHook({ isOpen: true });

    const { user } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(2)} />,
    );

    act(() => {
      triggerSlideChange(0.5);
    });

    await user.click(screen.getByTestId('modal-onboarding-previous'));

    expect(mockSwiperInstance.slidePrev).toHaveBeenCalled();
  });

  it('shows the next button only when there is more than one item and progress is below 1', () => {
    setHook({ isOpen: true });

    const { rerender } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(1)} />,
    );

    // Single item: next never renders, regardless of progress.
    expect(
      screen.queryByTestId('modal-onboarding-next'),
    ).not.toBeInTheDocument();

    rerender(<OnboardingModal id="onboarding-id" items={makeItems(2)} />);

    // Multiple items, progress still 0: next renders.
    expect(screen.getByTestId('modal-onboarding-next')).toBeInTheDocument();

    act(() => {
      triggerSlideChange(1);
    });

    // Multiple items, progress reached 1: next disappears.
    expect(
      screen.queryByTestId('modal-onboarding-next'),
    ).not.toBeInTheDocument();
  });

  it('calls swiperInstance.slideNext when the next button is clicked', async () => {
    setHook({ isOpen: true });

    const { user } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(2)} />,
    );

    await user.click(screen.getByTestId('modal-onboarding-next'));

    expect(mockSwiperInstance.slideNext).toHaveBeenCalled();
  });

  it('shows the close button for a single item even at progress 0', () => {
    setHook({ isOpen: true });

    render(<OnboardingModal id="onboarding-id" items={makeItems(1)} />);

    expect(screen.getByTestId('modal-onboarding-close')).toBeInTheDocument();
  });

  it('shows the close button only once progress reaches 1 for multiple items', () => {
    setHook({ isOpen: true });

    render(<OnboardingModal id="onboarding-id" items={makeItems(2)} />);

    expect(
      screen.queryByTestId('modal-onboarding-close'),
    ).not.toBeInTheDocument();

    act(() => {
      triggerSlideChange(1);
    });

    expect(screen.getByTestId('modal-onboarding-close')).toBeInTheDocument();
  });

  it('saves the preference on close when isOnboarding is true', async () => {
    setHook({ isOpen: true, isOnboarding: true });

    const { user } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(1)} />,
    );

    await user.click(screen.getByTestId('modal-onboarding-close'));

    expect(mockHandleSavePreference).toHaveBeenCalled();
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it('closes without saving a preference when isOnboarding is false', async () => {
    setHook({ isOpen: true, isOnboarding: false });

    const { user } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(1)} />,
    );

    await user.click(screen.getByTestId('modal-onboarding-close'));

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockHandleSavePreference).not.toHaveBeenCalled();
  });

  it('appends a swiper stylesheet link on mount and removes it on unmount', () => {
    setHook({ isOpen: true });

    const { unmount } = render(
      <OnboardingModal id="onboarding-id" items={makeItems(1)} />,
    );

    const link = document.head.querySelector('link[href*="swiper"]');
    expect(link).toBeInTheDocument();

    unmount();

    expect(document.head.querySelector('link[href*="swiper"]')).toBeNull();
  });
});
