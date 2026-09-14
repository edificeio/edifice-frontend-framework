import { render, screen } from '~/setup';
import {
  WidgetPersonalizationItem,
  WidgetsPersonalizationPanel,
} from './WidgetsPersonalizationPanel';

const items: WidgetPersonalizationItem[] = [
  { id: 'agenda-widget', label: 'Agenda', icon: <span />, checked: true },
  {
    id: 'carnet-de-bord',
    label: 'Carnet de bord',
    icon: <span />,
    checked: true,
    locked: true,
  },
];

describe('WidgetsPersonalizationPanel', () => {
  it('renders a row per widget, with a toggle', () => {
    render(
      <WidgetsPersonalizationPanel
        items={items}
        onToggle={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Agenda')).toBeInTheDocument();
    expect(screen.getByText('Carnet de bord')).toBeInTheDocument();
    expect(
      screen.getByRole('switch', { name: 'Activer le widget Agenda' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('renders a lock indicator instead of a toggle for a locked widget', () => {
    render(
      <WidgetsPersonalizationPanel
        items={items}
        onToggle={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('switch', {
        name: 'Activer le widget Carnet de bord',
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText('Imposé par votre établissement'),
    ).toBeInTheDocument();
  });

  it('calls onToggle with the widget id when its toggle is clicked', async () => {
    const onToggle = vi.fn();
    const { user } = render(
      <WidgetsPersonalizationPanel
        items={items}
        onToggle={onToggle}
        onClose={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole('switch', { name: 'Activer le widget Agenda' }),
    );

    expect(onToggle).toHaveBeenCalledWith('agenda-widget');
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    const { user } = render(
      <WidgetsPersonalizationPanel
        items={items}
        onToggle={vi.fn()}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByLabelText('Close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows a skeleton list while loading, no items', () => {
    render(
      <WidgetsPersonalizationPanel
        items={items}
        isLoading
        onToggle={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByText('Agenda')).not.toBeInTheDocument();
    expect(
      screen.getByText('Personnalisation des widgets'),
    ).toBeInTheDocument();
  });

  it('shows the empty state when there are no items', () => {
    render(
      <WidgetsPersonalizationPanel
        items={[]}
        onToggle={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Aucun widget disponible pour votre établissement.'),
    ).toBeInTheDocument();
  });
});
