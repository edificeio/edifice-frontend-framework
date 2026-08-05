import { ILinkedResource } from '@edifice.io/client';
import { render, screen } from '~/setup';
import LinkerCard, { ILinkedResourceWithDate } from './LinkerCard';

const { fromNow } = vi.hoisted(() => ({
  fromNow: vi.fn(() => 'il y a 2 jours'),
}));

vi.mock('../../../hooks', () => ({ useDate: () => ({ fromNow }) }));

function resource(
  partial: Partial<ILinkedResourceWithDate> = {},
): ILinkedResourceWithDate {
  return {
    assetId: 'asset-1',
    name: 'Compte rendu',
    creatorName: 'Marie Dupont',
    application: 'blog',
    modifiedAt: '2026-07-30',
    path: '/blog/asset-1',
    ...partial,
  } as unknown as ILinkedResource as ILinkedResourceWithDate;
}

describe('LinkerCard', () => {
  it('shows the resource name and its author', () => {
    render(<LinkerCard doc={resource()} />);

    expect(screen.getByText('Compte rendu')).toBeInTheDocument();
    expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
  });

  it('computes the modification date from now', () => {
    render(<LinkerCard doc={resource()} />);

    expect(fromNow).toHaveBeenCalledWith('2026-07-30');
    expect(screen.getByText('il y a 2 jours')).toBeInTheDocument();
  });

  it('prefers a date already computed by the caller', () => {
    render(<LinkerCard doc={resource({ fromDate: 'hier' })} />);

    expect(screen.getByText('hier')).toBeInTheDocument();
    expect(fromNow).not.toHaveBeenCalled();
  });

  it('shows the thumbnail when the resource has one', () => {
    const { container } = render(
      <LinkerCard doc={resource({ thumbnail: '/workspace/thumb' } as never)} />,
    );

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/workspace/thumb',
    );
  });

  it('falls back to the application icon without a thumbnail', () => {
    const { container } = render(<LinkerCard doc={resource()} />);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.card-image svg')).not.toBeNull();
  });

  it('falls back to the application icon on an empty thumbnail', () => {
    const { container } = render(
      <LinkerCard doc={resource({ thumbnail: '' } as never)} />,
    );

    expect(container.querySelector('img')).toBeNull();
  });

  it('flags a shared resource', () => {
    const { container } = render(
      <LinkerCard doc={resource({ shared: true } as never)} />,
    );

    // The users icon sits next to the date, after the card image.
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(1);
  });

  it('flags nothing on a private resource', () => {
    const { container: shared } = render(
      <LinkerCard doc={resource({ shared: true } as never)} />,
    );
    const withShare = shared.querySelectorAll('svg').length;

    const { container: privateOne } = render(<LinkerCard doc={resource()} />);

    expect(privateOne.querySelectorAll('svg').length).toBeLessThan(withShare);
  });

  it('is clickable by default', async () => {
    const onClick = vi.fn();
    const { user } = render(<LinkerCard doc={resource()} onClick={onClick} />);

    await user.click(
      screen.getByRole('button', { name: 'card.open.resource' }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('appends the custom classes to the card', () => {
    render(<LinkerCard doc={resource()} className="my-linker" />);

    expect(document.querySelector('.card-linker')).toHaveClass(
      'shadow-none',
      'my-linker',
    );
  });
});
