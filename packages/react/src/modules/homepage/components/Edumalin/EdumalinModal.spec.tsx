import { render, screen } from '~/setup';
import EdumalinModal from './EdumalinModal';
import { EdumalinItem } from './types';

const announcement: EdumalinItem = {
  title: 'Nouvelle fonctionnalité',
  description: 'Une description complète, jamais tronquée dans la modale.',
  type: { name: 'Annonce' },
};

const renderModal = (item: EdumalinItem) => {
  const handlers = {
    onClose: vi.fn(),
    onEdumalinClick: vi.fn(),
    onActionClick: vi.fn(),
  };
  return {
    ...render(<EdumalinModal item={item} {...handlers} />),
    ...handlers,
  };
};

describe('EdumalinModal', () => {
  it('opens Édumalin from the secondary button', async () => {
    const { user, onEdumalinClick } = renderModal(announcement);

    await user.click(
      screen.getByRole('button', { name: 'Accéder à Édumalin' }),
    );

    expect(onEdumalinClick).toHaveBeenCalled();
  });

  it('shows the Édumalin action button only when the item has a link', async () => {
    const { user, onActionClick, unmount } = renderModal({
      ...announcement,
      buttonTitle: 'S’inscrire',
      buttonLink: 'https://edumalin.fr/inscription',
    });

    await user.click(screen.getByRole('button', { name: 'S’inscrire' }));
    expect(onActionClick).toHaveBeenCalledWith(
      'https://edumalin.fr/inscription',
    );
    unmount();

    renderModal({ ...announcement, buttonTitle: 'S’inscrire' });
    expect(
      screen.queryByRole('button', { name: 'S’inscrire' }),
    ).not.toBeInTheDocument();
  });

  it('ignores links that are not http(s) URLs', () => {
    renderModal({
      ...announcement,
      type: { name: 'RDV' },
      googleMap: 'javascript:alert(1)',
      buttonTitle: 'S’inscrire',
      buttonLink: 'javascript:alert(1)',
    });

    expect(
      screen.queryByRole('button', { name: 'S’inscrire' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Lieu :')).not.toBeInTheDocument();
  });

  it('shows the date and duration of a webinar', () => {
    renderModal({
      ...announcement,
      type: { name: 'Webinaire' },
      dateTime: '2027-01-18T14:00:00',
      duration: 30,
    });

    expect(screen.getByText('18/01/2027')).toBeInTheDocument();
    expect(screen.getByText('30min')).toBeInTheDocument();
  });

  it('never shows an empty date or duration label', () => {
    renderModal({ ...announcement, type: { name: 'Webinaire' } });

    expect(screen.queryByText('Date :')).not.toBeInTheDocument();
    expect(screen.queryByText('Durée :')).not.toBeInTheDocument();
  });

  it('links to the place of an RDV in a new tab, only when known', () => {
    const googleMap = 'https://maps.app.goo.gl/XNV5D74URCxvhiff7';
    const { unmount } = renderModal({
      ...announcement,
      type: { name: 'RDV' },
      googleMap,
    });

    const link = screen.getByRole('link', { name: googleMap });
    expect(link).toHaveAttribute('href', googleMap);
    expect(link).toHaveAttribute('target', '_blank');
    unmount();

    renderModal({ ...announcement, type: { name: 'RDV' } });
    expect(screen.queryByText('Lieu :')).not.toBeInTheDocument();
  });
});
