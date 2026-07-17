import { render, screen } from '~/setup';
import Tabs from './components/Tabs';
import { TabsItemProps } from './components/TabsItem';

const items: TabsItemProps[] = [
  { id: 'one', icon: null, label: 'One', content: <div>Content one</div> },
  { id: 'two', icon: null, label: 'Two', content: <div>Content two</div> },
  {
    id: 'three',
    icon: null,
    label: 'Three',
    content: <div>Content three</div>,
  },
];

function getTab(name: string) {
  return screen.getByRole('tab', { name });
}

describe('Tabs', () => {
  it('renders the tab list and the default panel content', () => {
    render(<Tabs defaultId="one" items={items} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(getTab('One')).toHaveAttribute('aria-selected', 'true');
    expect(getTab('Two')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Content one')).toBeInTheDocument();
  });

  it('only gives tabIndex 0 to the active tab (roving tabindex)', () => {
    render(<Tabs defaultId="one" items={items} />);

    expect(getTab('One')).toHaveAttribute('tabindex', '0');
    expect(getTab('Two')).toHaveAttribute('tabindex', '-1');
    expect(getTab('Three')).toHaveAttribute('tabindex', '-1');
  });

  it('switches tab and calls onChange when clicking another tab', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <Tabs defaultId="one" items={items} onChange={onChange} />,
    );

    await user.click(getTab('Two'));

    expect(getTab('Two')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content two')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'two' }),
    );
  });

  it('moves to the next/previous tab with ArrowRight/ArrowLeft, wrapping at the ends', async () => {
    const { user } = render(<Tabs defaultId="one" items={items} />);

    getTab('One').focus();
    await user.keyboard('{ArrowLeft}');
    expect(getTab('Three')).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowRight}');
    expect(getTab('One')).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowRight}');
    expect(getTab('Two')).toHaveAttribute('aria-selected', 'true');
  });

  it('jumps to the first/last tab with Home/End', async () => {
    const { user } = render(<Tabs defaultId="two" items={items} />);

    getTab('Two').focus();
    await user.keyboard('{End}');
    expect(getTab('Three')).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(getTab('One')).toHaveAttribute('aria-selected', 'true');
  });
});
