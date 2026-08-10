import { createRef } from 'react';

import { fireEvent, render, screen } from '~/setup';
import { Dropdown } from '../Dropdown';
import { Toolbar, ToolbarItem } from './Toolbar';

function getButtons(container: HTMLElement) {
  return Array.from(container.querySelectorAll('button'));
}

describe('Toolbar', () => {
  beforeAll(() => {
    // Toolbar unconditionally calls useBreakpoint, which relies on
    // window.matchMedia, absent from jsdom.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders a divider as a plain, non-interactive element', () => {
    const items: ToolbarItem[] = [{ type: 'divider' }];
    const { container } = render(<Toolbar items={items} />);

    expect(container.querySelector('.toolbar-divider')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a button item with tertiary/ghost styling by default', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'save', props: { children: 'Save' } },
    ];
    render(<Toolbar items={items} />);

    const button = screen.getByRole('button', { name: 'save' });
    expect(button).toHaveTextContent('Save');
    expect(button).toHaveClass('btn-ghost-tertiary');
  });

  it('renders an icon item, overridable color/variant', () => {
    // Unlike 'button' items, 'icon' items don't get an automatic aria-label
    // from `name` — it must be set explicitly via props.
    const items: ToolbarItem[] = [
      {
        type: 'icon',
        name: 'delete',
        props: {
          'icon': <span>icon</span>,
          'aria-label': 'delete',
          'color': 'danger',
          'variant': 'outline',
        },
      },
    ];
    render(<Toolbar items={items} />);

    expect(screen.getByRole('button', { name: 'delete' })).toHaveClass(
      'btn-outline-danger',
    );
  });

  it('renders a primary item as filled/primary, ignoring color/variant overrides', () => {
    const items: ToolbarItem[] = [
      {
        type: 'primary',
        name: 'submit',
        props: { children: 'Submit', color: 'secondary', variant: 'outline' },
      },
    ];
    render(<Toolbar items={items} />);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass(
      'btn-filled btn-primary',
    );
  });

  it('skips rendering items with visibility "hide"', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'visible', props: { children: 'Visible' } },
      {
        type: 'button',
        name: 'hidden',
        visibility: 'hide',
        props: { children: 'Hidden' },
      },
    ];
    render(<Toolbar items={items} />);

    expect(screen.getByRole('button', { name: 'visible' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'hidden' }),
    ).not.toBeInTheDocument();
  });

  it('renders a dropdown item using its own trigger/menu content', async () => {
    const items: ToolbarItem[] = [
      {
        type: 'dropdown',
        name: 'more',
        props: {
          children: (
            <>
              <Dropdown.Trigger label="More" />
              <Dropdown.Menu>
                <Dropdown.Item type="action">Option</Dropdown.Item>
              </Dropdown.Menu>
            </>
          ),
        },
      },
    ];
    const { user } = render(<Toolbar items={items} />);

    await user.click(screen.getByRole('button', { name: 'More' }));

    expect(screen.getByText('Option')).toBeInTheDocument();
  });

  it('gives tabIndex 0 only to the first enabled button/icon item, skipping disabled ones', () => {
    const items: ToolbarItem[] = [
      {
        type: 'button',
        name: 'disabled',
        props: { children: 'Disabled', disabled: true },
      },
      {
        type: 'icon',
        name: 'first-enabled',
        props: { 'icon': <span>i</span>, 'aria-label': 'first-enabled' },
      },
      { type: 'button', name: 'second-enabled', props: { children: 'Second' } },
    ];
    render(<Toolbar items={items} />);

    expect(screen.getByRole('button', { name: 'disabled' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(
      screen.getByRole('button', { name: 'first-enabled' }),
    ).toHaveAttribute('tabindex', '0');
    expect(
      screen.getByRole('button', { name: 'second-enabled' }),
    ).toHaveAttribute('tabindex', '-1');
  });

  it('navigates between enabled items with ArrowRight/ArrowLeft, wrapping at the ends', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'one', props: { children: 'One' } },
      { type: 'button', name: 'two', props: { children: 'Two' } },
      { type: 'button', name: 'three', props: { children: 'Three' } },
    ];
    const { container } = render(<Toolbar items={items} />);
    const [one, two, three] = getButtons(container);

    one.focus();
    fireEvent.keyDown(one, { code: 'ArrowRight' });
    expect(two).toHaveFocus();

    fireEvent.keyDown(two, { code: 'ArrowRight' });
    expect(three).toHaveFocus();

    fireEvent.keyDown(three, { code: 'ArrowRight' });
    expect(one).toHaveFocus();

    fireEvent.keyDown(one, { code: 'ArrowLeft' });
    expect(three).toHaveFocus();
  });

  it('adds/removes a focus class on the specific element that gains/loses focus', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'one', props: { children: 'One' } },
    ];
    render(<Toolbar items={items} />);
    const button = screen.getByRole('button', { name: 'one' });

    fireEvent.focus(button);
    expect(button).toHaveClass('focus');

    fireEvent.blur(button);
    expect(button).not.toHaveClass('focus');
  });

  it('hides the button label and forces size sm on mobile when shouldHideLabelsOnMobile is set', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'save', props: { children: 'Save' } },
    ];
    render(<Toolbar items={items} shouldHideLabelsOnMobile />);

    const button = screen.getByRole('button', { name: 'save' });
    expect(button).not.toHaveTextContent('Save');
    expect(button).toHaveClass('btn-sm');
  });

  it('shows the button label with size md when not hiding labels on mobile', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'save', props: { children: 'Save' } },
    ];
    render(<Toolbar items={items} />);

    const button = screen.getByRole('button', { name: 'save' });
    expect(button).toHaveTextContent('Save');
    expect(button).toHaveClass('btn-md');
  });

  it('respects an explicit custom size', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'save', props: { children: 'Save', size: 'lg' } },
    ];
    render(<Toolbar items={items} />);

    const button = screen.getByRole('button', { name: 'save' });
    expect(button).toHaveClass('btn-lg');
    expect(button).not.toHaveClass('btn-sm');
  });

  it('lets an explicit custom size take precedence over hideLabel', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'save', props: { children: 'Save', size: 'lg' } },
    ];
    render(<Toolbar items={items} shouldHideLabelsOnMobile />);

    const button = screen.getByRole('button', { name: 'save' });
    expect(button).toHaveClass('btn-lg');
    expect(button).not.toHaveClass('btn-sm');
  });

  it('forwards ariaControls and a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Toolbar items={[]} ariaControls="editor-1" ref={ref} />);

    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-controls', 'editor-1');
    expect(ref.current).toBe(toolbar);
  });

  it('moves to the previous item with ArrowLeft, away from the ends', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'one', props: { children: 'One' } },
      { type: 'button', name: 'two', props: { children: 'Two' } },
      { type: 'button', name: 'three', props: { children: 'Three' } },
    ];
    const { container } = render(<Toolbar items={items} />);
    const [one, , three] = getButtons(container);

    three.focus();
    fireEvent.keyDown(three, { code: 'ArrowLeft' });

    expect(getButtons(container)[1]).toHaveFocus();
    expect(one).not.toHaveFocus();
  });

  it('leaves the focus alone on any other key', () => {
    const items: ToolbarItem[] = [
      { type: 'button', name: 'one', props: { children: 'One' } },
      { type: 'button', name: 'two', props: { children: 'Two' } },
    ];
    const { container } = render(<Toolbar items={items} />);
    const [one] = getButtons(container);

    one.focus();
    fireEvent.keyDown(one, { code: 'KeyA' });

    expect(one).toHaveFocus();
  });

  describe('tooltips', () => {
    it('accepts a plain string, placed on top', async () => {
      const items: ToolbarItem[] = [
        {
          type: 'icon',
          name: 'save',
          tooltip: 'Save the document',
          props: { 'icon': <span />, 'aria-label': 'save' },
        },
      ];
      const { user } = render(<Toolbar items={items} />);

      await user.hover(screen.getByRole('button', { name: 'save' }));

      expect(await screen.findByText('Save the document')).toBeInTheDocument();
    });

    it('accepts a message and its position', async () => {
      const items: ToolbarItem[] = [
        {
          type: 'icon',
          name: 'save',
          tooltip: { message: 'Save the document', position: 'bottom' },
          props: { 'icon': <span />, 'aria-label': 'save' },
        },
      ];
      const { user } = render(<Toolbar items={items} />);

      await user.hover(screen.getByRole('button', { name: 'save' }));

      expect(await screen.findByText('Save the document')).toBeInTheDocument();
    });

    it('renders no tooltip when the item declares none', async () => {
      const items: ToolbarItem[] = [
        {
          type: 'icon',
          name: 'save',
          props: { 'icon': <span />, 'aria-label': 'save' },
        },
      ];
      const { user } = render(<Toolbar items={items} />);

      await user.hover(screen.getByRole('button', { name: 'save' }));

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('items without a name', () => {
    it('falls back to the item index as a key for a button', () => {
      const items = [
        { type: 'button', props: { children: 'First' } },
        { type: 'button', props: { children: 'Second' } },
      ] as unknown as ToolbarItem[];
      const { container } = render(<Toolbar items={items} />);

      expect(getButtons(container)).toHaveLength(2);
    });

    it('falls back to the item index as a key for an icon', () => {
      const items = [
        { type: 'icon', props: { icon: <span /> } },
        { type: 'icon', props: { icon: <span /> } },
      ] as unknown as ToolbarItem[];
      const { container } = render(<Toolbar items={items} />);

      expect(getButtons(container)).toHaveLength(2);
    });

    it('falls back to the item index as a key for a dropdown', () => {
      const items = [
        {
          type: 'dropdown',
          props: {
            children: (triggerProps: object) => (
              <>
                <Dropdown.Trigger label="More" {...triggerProps} />
                <Dropdown.Menu>
                  <Dropdown.Item>Action</Dropdown.Item>
                </Dropdown.Menu>
              </>
            ),
          },
        },
      ] as unknown as ToolbarItem[];

      render(<Toolbar items={items} />);

      expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    });
  });

  it('renders nothing for an unknown item type', () => {
    const items = [
      { type: 'unknown-type', name: 'ghost', props: {} },
    ] as unknown as ToolbarItem[];

    render(<Toolbar items={items} />);

    expect(screen.getByRole('toolbar')).toBeEmptyDOMElement();
  });
});
