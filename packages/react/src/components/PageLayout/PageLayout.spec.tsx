import { render, screen } from '~/setup';
import PageLayout from './PageLayout';
import { useOverlayStore } from './store/overlayStore';

vi.mock(
  '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook',
  () => ({ useEdificeTheme: () => ({ theme: { basePath: '/assets' } }) }),
);

// The default header pulls the whole homepage header in; the layout itself is
// what is under test here.
vi.mock('../../modules/homepage/components/Header/Header', () => ({
  default: () => <div data-testid="default-header" />,
}));

const root = () => document.querySelector('.pagelayout');
const mainArea = () => document.querySelector('.pagelayout-mainarea');

describe('PageLayout', () => {
  afterEach(() => {
    useOverlayStore.setState({ overlayOpen: false });
  });

  describe('root', () => {
    it('renders the centered variant by default', () => {
      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(root()).toHaveClass('pagelayout', 'pagelayout-centered');
      expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('renders the fullpage variant when asked', () => {
      render(
        <PageLayout variant="fullpage">
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(root()).toHaveClass('pagelayout-fullpage');
    });

    it('carries the scroll mode as a class', () => {
      render(
        <PageLayout scrollMode="page">
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(root()).toHaveClass('pagelayout-scroll-page');
    });

    it('carries no scroll class without a scroll mode', () => {
      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(root()?.className).not.toContain('pagelayout-scroll-');
    });

    it('appends the custom classes and forwards the remaining props', () => {
      render(
        <PageLayout className="my-page" id="page-1">
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(root()).toHaveClass('my-page');
      expect(root()).toHaveAttribute('id', 'page-1');
    });
  });

  describe('main area layout', () => {
    it('flags both sidebars', () => {
      render(
        <PageLayout>
          <PageLayout.SidebarLeft>left</PageLayout.SidebarLeft>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.SidebarRight>right</PageLayout.SidebarRight>
        </PageLayout>,
      );

      expect(mainArea()).toHaveClass('has-both-sidebars');
    });

    it('flags a left sidebar alone', () => {
      render(
        <PageLayout>
          <PageLayout.SidebarLeft>left</PageLayout.SidebarLeft>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(mainArea()).toHaveClass('has-left-sidebar-only');
    });

    it('flags a right sidebar alone', () => {
      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.SidebarRight>right</PageLayout.SidebarRight>
        </PageLayout>,
      );

      expect(mainArea()).toHaveClass('has-right-sidebar-only');
    });

    it('flags no sidebar when there is none', () => {
      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(mainArea()?.className).toBe('pagelayout-mainarea');
    });

    it('adds a gap on demand', () => {
      render(
        <PageLayout withGap>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(mainArea()).toHaveClass('has-gap');
    });

    it('keeps a plain child inside the main area', () => {
      render(
        <PageLayout>
          <span>loose child</span>
        </PageLayout>,
      );

      expect(mainArea()).toContainElement(screen.getByText('loose child'));
    });

    // `Children.toArray` flattens nested arrays but keeps a fragment as a single
    // child, so the compound parts inside it are never recognised — contrary to
    // what the comment in PageLayout.tsx claims. A fragment-wrapped sidebar ends
    // up rendered as a plain child, without its layout class.
    it('does not detect compound children wrapped in a fragment', () => {
      render(
        <PageLayout>
          <>
            <PageLayout.SidebarLeft>left</PageLayout.SidebarLeft>
            <PageLayout.Content>content</PageLayout.Content>
          </>
        </PageLayout>,
      );

      expect(mainArea()).not.toHaveClass('has-left-sidebar-only');
      expect(screen.getByText('left')).toBeInTheDocument();
    });

    it('detects compound children passed as an array', () => {
      render(
        <PageLayout>
          {[
            <PageLayout.SidebarLeft key="left">left</PageLayout.SidebarLeft>,
            <PageLayout.Content key="content">content</PageLayout.Content>,
          ]}
        </PageLayout>,
      );

      expect(mainArea()).toHaveClass('has-left-sidebar-only');
    });
  });

  describe('header', () => {
    it('renders the custom header and its spacer', () => {
      render(
        <PageLayout>
          <PageLayout.Header>
            <span>my header</span>
          </PageLayout.Header>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(screen.getByText('my header')).toBeInTheDocument();
      expect(
        document.querySelector('.pagelayout-headerspacer'),
      ).toBeInTheDocument();
    });

    it('renders no spacer without a header', () => {
      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(document.querySelector('.pagelayout-headerspacer')).toBeNull();
    });

    it('falls back to the platform header when none is provided', () => {
      render(
        <PageLayout>
          <PageLayout.Header />
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(screen.getByTestId('default-header')).toBeInTheDocument();
    });
  });

  describe('breadcrumb placement', () => {
    it('sits outside the main area in centered mode', () => {
      render(
        <PageLayout>
          <PageLayout.Breadcrumb>crumbs</PageLayout.Breadcrumb>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(mainArea()).not.toContainElement(screen.getByText('crumbs'));
      expect(root()).toContainElement(screen.getByText('crumbs'));
    });

    it('sits inside the main area in fullpage mode', () => {
      render(
        <PageLayout variant="fullpage">
          <PageLayout.Breadcrumb>crumbs</PageLayout.Breadcrumb>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(mainArea()).toContainElement(screen.getByText('crumbs'));
    });
  });

  describe('no-padding configuration', () => {
    it('propagates the flags to each column through the context', () => {
      render(
        <PageLayout
          noPadding={{ sidebarLeft: true, content: true, sidebarRight: true }}
        >
          <PageLayout.SidebarLeft>left</PageLayout.SidebarLeft>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.SidebarRight>right</PageLayout.SidebarRight>
        </PageLayout>,
      );

      expect(document.querySelector('.pagelayout-sidebarleft')).toHaveClass(
        'pagelayout-sidebarleft--no-padding',
      );
      expect(document.querySelector('.pagelayout-content')).toHaveClass(
        'pagelayout-content--no-padding',
      );
      expect(document.querySelector('.pagelayout-sidebarright')).toHaveClass(
        'pagelayout-sidebarright--no-padding',
      );
    });

    it('keeps the padding by default', () => {
      render(
        <PageLayout>
          <PageLayout.SidebarLeft>left</PageLayout.SidebarLeft>
          <PageLayout.Content>content</PageLayout.Content>
        </PageLayout>,
      );

      expect(document.querySelector('.pagelayout-content')?.className).toBe(
        'pagelayout-content',
      );
    });
  });

  describe('overlay', () => {
    it('is closed and inert by default', () => {
      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      const overlay = document.querySelector('.pagelayout-overlay');
      expect(overlay).not.toHaveClass('pagelayout-overlay-open');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
      expect(
        screen.queryByTestId('pagelayout-overlay-close-button'),
      ).not.toBeInTheDocument();
    });

    it('opens with a close button when the store says so', () => {
      useOverlayStore.setState({ overlayOpen: true });

      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      expect(document.querySelector('.pagelayout-overlay')).toHaveClass(
        'pagelayout-overlay-open',
      );
      expect(
        screen.getByTestId('pagelayout-overlay-close-button'),
      ).toBeInTheDocument();
    });

    it('closes on the close button and notifies the caller', async () => {
      useOverlayStore.setState({ overlayOpen: true });
      const onClose = vi.fn();

      const { user } = render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay onClose={onClose}>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      await user.click(screen.getByTestId('pagelayout-overlay-close-button'));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(useOverlayStore.getState().overlayOpen).toBe(false);
    });

    it('hides the close button on demand', () => {
      useOverlayStore.setState({ overlayOpen: true });

      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay closeButton={false}>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      expect(
        screen.queryByTestId('pagelayout-overlay-close-button'),
      ).not.toBeInTheDocument();
    });

    it('renders a backdrop closing the overlay on click', async () => {
      useOverlayStore.setState({ overlayOpen: true });
      const onClose = vi.fn();

      const { user } = render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay backdrop onClose={onClose}>
            panel
          </PageLayout.Overlay>
        </PageLayout>,
      );

      const backdrop = document.querySelector('.pagelayout-overlaybackdrop');
      expect(backdrop).toBeInTheDocument();

      await user.click(backdrop as Element);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders no backdrop by default', () => {
      useOverlayStore.setState({ overlayOpen: true });

      render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      expect(document.querySelector('.pagelayout-overlaybackdrop')).toBeNull();
    });

    it('closes on the Escape key while open', async () => {
      useOverlayStore.setState({ overlayOpen: true });
      const onClose = vi.fn();

      const { user } = render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay onClose={onClose}>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(useOverlayStore.getState().overlayOpen).toBe(false);
    });

    it('ignores the Escape key while closed', async () => {
      const onClose = vi.fn();

      const { user } = render(
        <PageLayout>
          <PageLayout.Content>content</PageLayout.Content>
          <PageLayout.Overlay onClose={onClose}>panel</PageLayout.Overlay>
        </PageLayout>,
      );

      await user.keyboard('{Escape}');

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('exposes readable display names for the compound parts', () => {
    expect(PageLayout.displayName).toBe('PageLayout');
    expect(PageLayout.Content.displayName).toBe('PageLayout.Content');
    expect(PageLayout.Overlay.displayName).toBe('PageLayout.Overlay');
  });
});
