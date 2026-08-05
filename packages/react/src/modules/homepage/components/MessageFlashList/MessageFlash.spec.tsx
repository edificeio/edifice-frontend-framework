import { IFlashMessageModel } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import MessageFlash from './MessageFlash';

const { useEdificeClient, useBreakpoint } = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
  useBreakpoint: vi.fn(),
}));

vi.mock('../../../..', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../..')>()),
  useEdificeClient,
  useBreakpoint,
}));

function message(
  partial: Partial<IFlashMessageModel> = {},
): IFlashMessageModel {
  return {
    id: 'flash-1',
    title: 'Message important',
    contents: { en: 'English content', fr: 'Contenu français' },
    color: 'blue',
    signature: '',
    ...partial,
  } as unknown as IFlashMessageModel;
}

/** jsdom measures nothing, so the overflow detection is driven by scrollHeight. */
function stubHeights({
  scrollHeight,
  lineHeight = '20px',
}: {
  scrollHeight: number;
  lineHeight?: string;
}) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight',
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });

  const computedStyle = vi
    .spyOn(window, 'getComputedStyle')
    .mockReturnValue({ lineHeight, fontSize: '16px' } as CSSStyleDeclaration);

  return () => {
    computedStyle.mockRestore();
    if (descriptor) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', descriptor);
    }
  };
}

const content = () => document.querySelector('.message-flash-content');

describe('MessageFlash', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ currentLanguage: 'en' });
    useBreakpoint.mockReturnValue({ lg: true });
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('content language', () => {
    it('shows the content in the session language', () => {
      render(<MessageFlash message={message()} />);

      expect(content()).toHaveTextContent('English content');
    });

    it('falls back to French when the session language is missing', () => {
      useEdificeClient.mockReturnValue({ currentLanguage: 'de' });

      render(<MessageFlash message={message()} />);

      expect(content()).toHaveTextContent('Contenu français');
    });

    it('falls back to the first non-null content when French is missing too', () => {
      useEdificeClient.mockReturnValue({ currentLanguage: 'de' });

      render(
        <MessageFlash
          message={message({
            contents: { es: null, it: 'Contenuto' } as never,
          })}
        />,
      );

      expect(content()).toHaveTextContent('Contenuto');
    });

    it('renders an empty body without any content', () => {
      render(<MessageFlash message={message({ contents: undefined })} />);

      expect(content()).toBeEmptyDOMElement();
    });

    it('renders the content as HTML', () => {
      render(
        <MessageFlash
          message={message({
            contents: { en: '<strong>bold</strong>' } as never,
          })}
        />,
      );

      expect(content()?.querySelector('strong')).toHaveTextContent('bold');
    });
  });

  describe('appearance', () => {
    it('carries the color modifier class', () => {
      render(<MessageFlash message={message({ color: 'red' })} />);

      expect(document.querySelector('.message-flash')).toHaveClass(
        'message-flash-red',
      );
    });

    it('carries no modifier class without a color', () => {
      render(<MessageFlash message={message({ color: undefined })} />);

      expect(document.querySelector('.message-flash')?.className).toBe(
        'message-flash',
      );
    });

    it('shows a warning icon on a red message', () => {
      render(<MessageFlash message={message({ color: 'red' })} />);

      expect(screen.getByRole('img', { name: 'warning' })).toBeInTheDocument();
    });

    it('shows an information icon otherwise', () => {
      render(<MessageFlash message={message()} />);

      expect(
        screen.getByRole('img', { name: 'information' }),
      ).toBeInTheDocument();
    });

    it('displays the title and the signature', () => {
      render(<MessageFlash message={message({ signature: 'La direction' })} />);

      expect(screen.getByText('Message important')).toBeInTheDocument();
      expect(screen.getByText('La direction')).toBeInTheDocument();
    });

    it('truncates the content while collapsed', () => {
      render(<MessageFlash message={message()} />);

      expect(content()).toHaveClass('text-truncate', 'text-truncate-2');
    });
  });

  describe('closing', () => {
    it('calls back with the message', async () => {
      const onCloseMessage = vi.fn();
      const { user } = render(
        <MessageFlash message={message()} onCloseMessage={onCloseMessage} />,
      );

      await user.click(screen.getByTestId('message-flash-close-button'));

      expect(onCloseMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'flash-1' }),
      );
    });

    it('does not fail without a callback', async () => {
      const { user } = render(<MessageFlash message={message()} />);

      await user.click(screen.getByTestId('message-flash-close-button'));

      expect(screen.getByText('Message important')).toBeInTheDocument();
    });
  });

  describe('collapsing a long message', () => {
    it('offers no toggle when the content fits in two lines', async () => {
      const restore = stubHeights({ scrollHeight: 30 });

      render(<MessageFlash message={message()} />);

      await waitFor(() =>
        expect(
          screen.queryByTestId('message-flash-view-more-button'),
        ).not.toBeInTheDocument(),
      );
      restore();
    });

    it('offers a read-more toggle when the content overflows', async () => {
      const restore = stubHeights({ scrollHeight: 200 });

      render(<MessageFlash message={message()} />);

      expect(
        await screen.findByTestId('message-flash-view-more-button'),
      ).toHaveAttribute('aria-expanded', 'false');
      restore();
    });

    it('expands and collapses the content through the toggle', async () => {
      const restore = stubHeights({ scrollHeight: 200 });
      const { user } = render(<MessageFlash message={message()} />);

      await user.click(
        await screen.findByTestId('message-flash-view-more-button'),
      );

      expect(content()).not.toHaveClass('text-truncate');
      const less = screen.getByTestId('message-flash-view-less-button');
      expect(less).toHaveAttribute('aria-expanded', 'true');

      await user.click(less);

      expect(content()).toHaveClass('text-truncate');
      restore();
    });

    // The close button would overlap the expanded text, so it is only rendered
    // when the message is collapsible and expanded, or not collapsible at all.
    it('hides the close button while a long message stays collapsed', async () => {
      const restore = stubHeights({ scrollHeight: 200 });
      const { user } = render(<MessageFlash message={message()} />);

      const more = await screen.findByTestId('message-flash-view-more-button');
      expect(
        screen.queryByTestId('message-flash-close-button'),
      ).not.toBeInTheDocument();

      await user.click(more);

      expect(
        screen.getByTestId('message-flash-close-button'),
      ).toBeInTheDocument();
      restore();
    });

    it('falls back on the font size when no line height is computed', async () => {
      // 16px * 1.2 * 2 lines + 2 = 40.4, so 60px of content overflows.
      const restore = stubHeights({ scrollHeight: 60, lineHeight: 'normal' });

      render(<MessageFlash message={message()} />);

      expect(
        await screen.findByTestId('message-flash-view-more-button'),
      ).toBeInTheDocument();
      restore();
    });
  });

  describe('responsive footer', () => {
    it('lays the footer out in a row on a large screen', () => {
      render(<MessageFlash message={message()} />);

      expect(document.querySelector('.message-flash-footer')).toHaveClass(
        'flex-row',
      );
    });

    it('stacks the footer on a small screen', () => {
      useBreakpoint.mockReturnValue({ lg: false });

      render(<MessageFlash message={message()} />);

      expect(document.querySelector('.message-flash-footer')).toHaveClass(
        'flex-column',
      );
    });
  });
});
