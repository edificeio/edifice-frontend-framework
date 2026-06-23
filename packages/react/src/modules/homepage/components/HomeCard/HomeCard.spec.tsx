import { render, screen } from '~/setup';
import HomeCard from './HomeCard';

describe('HomeCard', () => {
  it('renders with default "user" variant and base class', () => {
    render(
      <HomeCard>
        <HomeCard.Content>content</HomeCard.Content>
      </HomeCard>,
    );

    const card = screen.getByTestId('home-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('home-card');
    expect(card).toHaveClass('home-card--user');
    expect(card).toHaveAttribute('data-variant', 'user');
  });

  it.each(['user', 'primary', 'secondary'] as const)(
    'applies the variant class for "%s"',
    (variant) => {
      render(
        <HomeCard variant={variant}>
          <HomeCard.Content>content</HomeCard.Content>
        </HomeCard>,
      );

      const card = screen.getByTestId('home-card');
      expect(card).toHaveClass(`home-card--${variant}`);
      expect(card).toHaveAttribute('data-variant', variant);
    },
  );

  it('renders children when provided', () => {
    render(
      <HomeCard>
        <HomeCard.Header title="My title" />
        <HomeCard.Content>My content</HomeCard.Content>
      </HomeCard>,
    );

    expect(screen.getByText('My title')).toBeInTheDocument();
    expect(screen.getByText('My content')).toBeInTheDocument();
  });

  it('forwards a custom className', () => {
    render(
      <HomeCard className="extra-class">
        <HomeCard.Content>content</HomeCard.Content>
      </HomeCard>,
    );

    expect(screen.getByTestId('home-card')).toHaveClass('extra-class');
  });

  it('renders default header from headerProps when no children are passed', () => {
    render(
      <HomeCard
        headerProps={{
          title: 'From props',
          actionLabel: 'Action',
          onActionClick: () => {},
        }}
      />,
    );

    expect(screen.getByText('From props')).toBeInTheDocument();
    expect(screen.getByTestId('home-card-header-action')).toBeInTheDocument();
  });
});

describe('HomeCard.Header', () => {
  it('renders the title', () => {
    render(<HomeCard.Header title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hello').tagName).toBe('H3');
  });

  it('does not render the action button when no callback is provided', () => {
    render(<HomeCard.Header title="Hello" actionLabel="See more" />);
    expect(
      screen.queryByTestId('home-card-header-action'),
    ).not.toBeInTheDocument();
  });

  it('does not render the action button when no label is provided', () => {
    render(<HomeCard.Header title="Hello" onActionClick={() => {}} />);
    expect(
      screen.queryByTestId('home-card-header-action'),
    ).not.toBeInTheDocument();
  });

  it('renders the action button and calls the callback when clicked', async () => {
    const onActionClick = vi.fn();
    const { user } = render(
      <HomeCard.Header
        title="Hello"
        actionLabel="See more"
        onActionClick={onActionClick}
      />,
    );

    const button = screen.getByTestId('home-card-header-action');
    expect(button).toHaveTextContent('See more');

    await user.click(button);
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it('renders the action button with the ghost ButtonBeta variant', () => {
    render(
      <HomeCard.Header
        title="Hello"
        actionLabel="See more"
        onActionClick={() => {}}
      />,
    );

    expect(screen.getByTestId('home-card-header-action')).toHaveClass(
      'btn-beta--ghost',
    );
  });
});

describe('HomeCard.Content', () => {
  it('renders its children inside the content wrapper', () => {
    const { container } = render(
      <HomeCard.Content>
        <span>inner</span>
      </HomeCard.Content>,
    );

    const wrapper = container.querySelector('.home-card-content');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent('inner');
  });
});
