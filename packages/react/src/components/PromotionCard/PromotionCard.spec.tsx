import { render, screen } from '~/setup';
import PromotionCard from './PromotionCard';

describe('PromotionCard', () => {
  it('renders the full compound composition', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <PromotionCard borderColor="#faea9c" backgroundColor="#fff8dd">
        <PromotionCard.Header backgroundColor="#faea9c" textColor="#000">
          Header content
        </PromotionCard.Header>
        <PromotionCard.Icon
          backgroundColor="#FFEFE3"
          icon={<span>icon</span>}
        />
        <PromotionCard.Body textColor="#333">
          <PromotionCard.Title>Free creation</PromotionCard.Title>
          <PromotionCard.Description>
            Start your own document.
          </PromotionCard.Description>
          <PromotionCard.Footer>
            <button onClick={onClick}>New page</button>
          </PromotionCard.Footer>
        </PromotionCard.Body>
      </PromotionCard>,
    );

    expect(screen.getByText('Header content')).toBeInTheDocument();
    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Free creation', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Start your own document.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'New page' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies borderColor/backgroundColor as inline styles on the root', () => {
    const { container } = render(
      <PromotionCard borderColor="#faea9c" backgroundColor="#fff8dd">
        content
      </PromotionCard>,
    );

    expect(container.firstChild).toHaveClass('promotion-card');
    expect(container.firstChild).toHaveStyle({
      borderColor: '#faea9c',
      backgroundColor: '#fff8dd',
    });
  });

  it('applies backgroundColor/textColor as inline styles on Header and Icon', () => {
    render(
      <PromotionCard>
        <PromotionCard.Header backgroundColor="#faea9c" textColor="#111111">
          Header
        </PromotionCard.Header>
        <PromotionCard.Icon
          backgroundColor="#FFEFE3"
          icon={<span>icon</span>}
        />
      </PromotionCard>,
    );

    expect(screen.getByText('Header')).toHaveStyle({
      backgroundColor: '#faea9c',
      color: '#111111',
    });
    expect(screen.getByText('icon').parentElement).toHaveStyle({
      backgroundColor: '#FFEFE3',
    });
  });
});
