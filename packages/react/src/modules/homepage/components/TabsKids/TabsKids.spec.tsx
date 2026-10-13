import { useState } from 'react';
import { act, render, screen } from '~/setup';
import TabsKids, { TabsKidsProps } from './components/TabsKids';
import { TabsKidsItemProps } from './components/TabsKidsItem';

const items: TabsKidsItemProps[] = [
  { id: 'alice', label: 'Alice Martin' },
  { id: 'bob', label: 'Bob Durand' },
  { id: 'chloe', label: 'Chloé Petit' },
  { id: 'david', label: 'David Moreau' },
  { id: 'emma', label: 'Emma Leroy' },
];

const OVERFLOW_LABEL = 'More tabs';

const ControlledTabs = ({
  defaultId = 'alice',
  onChange,
  ...props
}: Partial<TabsKidsProps> & { defaultId?: string }) => {
  const [activeId, setActiveId] = useState(defaultId);
  return (
    <TabsKids
      items={items}
      overflowLabel={OVERFLOW_LABEL}
      ariaLabel="Children"
      {...props}
      activeId={activeId}
      onChange={(id) => {
        setActiveId(id);
        onChange?.(id);
      }}
    >
      <div>Content of {activeId}</div>
    </TabsKids>
  );
};

function getTab(name: string) {
  return screen.getByRole('tab', { name });
}

function getVisibleTabNames() {
  return screen.getAllByRole('tab').map((tab) => tab.getAttribute('title'));
}

/**
 * jsdom has no layout: fake the widths read by the overflow measurement.
 * Each tab is `TAB_WIDTH` wide unless `setTabWidth` says otherwise, the
 * overflow trigger `TRIGGER_WIDTH`, and the bar width can be changed through
 * `setBarWidth`.
 */
const TAB_WIDTH = 100;
const TRIGGER_WIDTH = 40;

function mockLayout(initialBarWidth: number) {
  let barWidth = initialBarWidth;
  let getTabWidth: (tab: HTMLElement) => number = () => TAB_WIDTH;
  let resizeCallback: (() => void) | undefined;

  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains('tabs-kids-bar') ? barWidth : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
    function (this: HTMLElement) {
      if (this.classList.contains('tabs-kids-item')) return getTabWidth(this);
      if (this.classList.contains('tabs-kids-measure-trigger'))
        return TRIGGER_WIDTH;
      return 0;
    },
  );

  // Padding, gap and inverted corner are not computed by jsdom.
  const realGetComputedStyle = window.getComputedStyle.bind(window);
  const overrides: Record<string, string> = {
    paddingInlineStart: '0px',
    paddingInlineEnd: '0px',
    columnGap: '0px',
  };
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
    // jsdom does not implement pseudo-elements: only `width` is read on them.
    const style = realGetComputedStyle(el);
    return new Proxy(style, {
      get(target, prop) {
        if (typeof prop === 'string' && prop in overrides)
          return overrides[prop];
        if (prop === 'width' && pseudo === '::after') return '0px';
        const value = Reflect.get(target, prop);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  });

  globalThis.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      resizeCallback = () => callback([], this);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  return {
    setBarWidth(width: number) {
      barWidth = width;
      act(() => resizeCallback?.());
    },
    setTabWidth(fn: (tab: HTMLElement) => number) {
      getTabWidth = fn;
    },
  };
}

// Every tab fits by default: the overflow tests narrow the bar themselves.
const originalResizeObserver = globalThis.ResizeObserver;
let layout: ReturnType<typeof mockLayout>;

beforeEach(() => {
  layout = mockLayout(items.length * TAB_WIDTH);
});

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.ResizeObserver = originalResizeObserver;
});

describe('TabsKids', () => {
  describe('selection', () => {
    it('renders a tab list with the active tab selected and its panel', () => {
      render(<ControlledTabs />);

      expect(
        screen.getByRole('tablist', { name: 'Children' }),
      ).toBeInTheDocument();
      expect(getTab('Alice Martin')).toHaveAttribute('aria-selected', 'true');
      expect(getTab('Bob Durand')).toHaveAttribute('aria-selected', 'false');

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveTextContent('Content of alice');
      expect(panel).toHaveAttribute('aria-labelledby', 'tabs-kids-alice');
      expect(getTab('Alice Martin')).toHaveAttribute('aria-controls', panel.id);
    });

    it('only gives tabIndex 0 to the active tab (roving tabindex)', () => {
      render(<ControlledTabs />);

      expect(getTab('Alice Martin')).toHaveAttribute('tabindex', '0');
      expect(getTab('Bob Durand')).toHaveAttribute('tabindex', '-1');
    });

    it('calls onChange and displays the content of a clicked tab', async () => {
      const onChange = vi.fn();
      const { user } = render(<ControlledTabs onChange={onChange} />);

      await user.click(getTab('Bob Durand'));

      expect(onChange).toHaveBeenCalledWith('bob');
      expect(getTab('Bob Durand')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content of bob');
    });

    it('renders no panel when activeId matches no item', () => {
      render(
        <TabsKids items={items} activeId="unknown" onChange={vi.fn()}>
          <div>Content</div>
        </TabsKids>,
      );

      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders a region named by the sole item instead of tabs', () => {
      render(
        <TabsKids items={[items[0]]} activeId="alice" onChange={vi.fn()}>
          <div>Content</div>
        </TabsKids>,
      );

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
      expect(
        screen.getByRole('region', { name: 'Alice Martin' }),
      ).toHaveTextContent('Content');
    });
  });

  describe('keyboard navigation', () => {
    it('selects and focuses the next/previous tab, wrapping at the ends', async () => {
      const { user } = render(<ControlledTabs />);

      getTab('Alice Martin').focus();
      await user.keyboard('{ArrowLeft}');
      expect(getTab('Emma Leroy')).toHaveFocus();
      expect(getTab('Emma Leroy')).toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{ArrowRight}');
      expect(getTab('Alice Martin')).toHaveFocus();
      expect(getTab('Alice Martin')).toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{ArrowRight}');
      expect(getTab('Bob Durand')).toHaveFocus();
    });

    it('goes to the first/last tab with Home/End', async () => {
      const { user } = render(<ControlledTabs defaultId="chloe" />);

      getTab('Chloé Petit').focus();
      await user.keyboard('{End}');
      expect(getTab('Emma Leroy')).toHaveFocus();

      await user.keyboard('{Home}');
      expect(getTab('Alice Martin')).toHaveFocus();
      expect(getTab('Alice Martin')).toHaveAttribute('aria-selected', 'true');
    });

    it('ignores the other keys', async () => {
      const onChange = vi.fn();
      const { user } = render(<ControlledTabs onChange={onChange} />);

      getTab('Alice Martin').focus();
      await user.keyboard('{ArrowDown}a');

      expect(onChange).not.toHaveBeenCalled();
      expect(getTab('Alice Martin')).toHaveFocus();
    });
  });

  describe('compact mode', () => {
    it('displays the full labels below 3 items', () => {
      render(<ControlledTabs items={items.slice(0, 2)} />);

      expect(getTab('Bob Durand')).toHaveTextContent('Bob Durand');
      expect(getTab('Bob Durand')).not.toHaveAttribute('aria-label');
    });

    it('abbreviates the inactive tabs from 3 items, keeping their accessible name', () => {
      render(<ControlledTabs items={items.slice(0, 3)} />);

      expect(getTab('Alice Martin')).toHaveTextContent('Alice Martin');
      expect(getTab('Bob Durand')).toHaveTextContent('B.');
      expect(getTab('Bob Durand')).toHaveAttribute('aria-label', 'Bob Durand');
    });
  });

  describe('overflow', () => {
    it('displays every tab without dropdown when they all fit', () => {
      render(<ControlledTabs />);

      expect(screen.getAllByRole('tab')).toHaveLength(5);
      expect(
        screen.queryByRole('button', { name: OVERFLOW_LABEL }),
      ).not.toBeInTheDocument();
    });

    it('moves the tabs that do not fit into the dropdown', async () => {
      // 350 - 40 (trigger) leaves room for 3 tabs of 100.
      layout.setBarWidth(350);
      const { user } = render(<ControlledTabs />);

      expect(getVisibleTabNames()).toEqual([
        'Alice Martin',
        'Bob Durand',
        'Chloé Petit',
      ]);

      await user.click(screen.getByRole('button', { name: OVERFLOW_LABEL }));
      const options = screen.getAllByRole('menuitemradio');
      expect(options.map((option) => option.textContent)).toEqual([
        'David Moreau',
        'Emma Leroy',
      ]);
    });

    it('keeps the active tab visible when it would overflow', () => {
      layout.setBarWidth(350);
      render(<ControlledTabs defaultId="emma" />);

      expect(getVisibleTabNames()).toEqual([
        'Alice Martin',
        'Bob Durand',
        'Emma Leroy',
      ]);
      expect(getTab('Emma Leroy')).toHaveAttribute('aria-selected', 'true');
    });

    it('selects an item from the dropdown and swaps it with the last visible tab', async () => {
      layout.setBarWidth(350);
      const onChange = vi.fn();
      const { user } = render(<ControlledTabs onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: OVERFLOW_LABEL }));
      await user.click(
        screen.getByRole('menuitemradio', { name: 'David Moreau' }),
      );

      expect(onChange).toHaveBeenCalledWith('david');
      expect(getVisibleTabNames()).toEqual([
        'Alice Martin',
        'Bob Durand',
        'David Moreau',
      ]);
      expect(getTab('David Moreau')).toHaveAttribute('aria-selected', 'true');
    });

    it('keeps the same number of visible tabs when the selection changes', async () => {
      // Once active, "Chloé Petit" is wider: measuring again would only leave
      // room for 2 tabs.
      layout.setTabWidth((tab) =>
        tab.textContent === 'Chloé Petit' ? 2 * TAB_WIDTH : TAB_WIDTH,
      );
      layout.setBarWidth(350);
      const { user } = render(<ControlledTabs />);

      await user.click(getTab('Chloé Petit'));
      expect(screen.getAllByRole('tab')).toHaveLength(3);

      await user.click(screen.getByRole('button', { name: OVERFLOW_LABEL }));
      await user.click(
        screen.getByRole('menuitemradio', { name: 'Emma Leroy' }),
      );
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('only navigates between visible tabs with the keyboard', async () => {
      layout.setBarWidth(350);
      const { user } = render(<ControlledTabs />);

      getTab('Alice Martin').focus();
      await user.keyboard('{End}');

      expect(getTab('Chloé Petit')).toHaveFocus();
      expect(getTab('Chloé Petit')).toHaveAttribute('aria-selected', 'true');
    });

    it('updates the visible tabs when the bar is resized', () => {
      render(<ControlledTabs />);
      expect(screen.getAllByRole('tab')).toHaveLength(5);

      // 250 - 40 (trigger) leaves room for 2 tabs.
      layout.setBarWidth(250);
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(
        screen.getByRole('button', { name: OVERFLOW_LABEL }),
      ).toBeInTheDocument();

      layout.setBarWidth(items.length * TAB_WIDTH);
      expect(screen.getAllByRole('tab')).toHaveLength(5);
      expect(
        screen.queryByRole('button', { name: OVERFLOW_LABEL }),
      ).not.toBeInTheDocument();
    });

    it('always displays at least the active tab', () => {
      layout.setBarWidth(50);
      render(<ControlledTabs defaultId="chloe" />);

      expect(getVisibleTabNames()).toEqual(['Chloé Petit']);
      expect(
        screen.getByRole('button', { name: OVERFLOW_LABEL }),
      ).toBeInTheDocument();
    });
  });
});
