import { render, screen } from '~/setup';
import LastInfos, { LastInfosProps } from './LastInfos';

function props(overrides: Partial<LastInfosProps> = {}): LastInfosProps {
  return {
    id: 42,
    icon: '/workspace/document/icon-id',
    threadId: 7,
    threadName: 'Informations importantes',
    title: 'Rentrée scolaire',
    content: '<p>Le contenu de l’actualité</p>',
    publicationDate: '2026-08-01T10:00:00Z',
    isHeadline: false,
    username: 'Pascal',
    ...overrides,
  };
}

const card = () => document.querySelector('.last-infos-card');
const medias = () => document.querySelectorAll('.last-infos-card-media');

describe('LastInfos', () => {
  describe('header', () => {
    it('shows the thread name and its icon', () => {
      render(<LastInfos {...props()} />);

      expect(screen.getByText('Informations importantes')).toBeInTheDocument();
      expect(screen.getByAltText('Informations importantes')).toHaveAttribute(
        'src',
        '/workspace/document/icon-id',
      );
    });

    it('falls back to the news icon without a thread icon', () => {
      render(<LastInfos {...props({ icon: '' })} />);

      expect(
        screen.queryByAltText('Informations importantes'),
      ).not.toBeInTheDocument();
      expect(
        document.querySelector('svg.last-infos-card-thread-icon'),
      ).not.toBeNull();
    });
  });

  describe('content', () => {
    it('shows the title and the text excerpt', () => {
      render(<LastInfos {...props()} />);

      expect(screen.getByText('Rentrée scolaire')).toBeInTheDocument();
      expect(screen.getByText('Le contenu de l’actualité')).toBeInTheDocument();
    });

    it('strips the media elements out of the excerpt', () => {
      render(
        <LastInfos
          {...props({
            content:
              '<p>Avant</p><img src="/a.png" /><video src="/v.mp4"></video><iframe src="/i"></iframe><p>Après</p>',
          })}
        />,
      );

      expect(
        document.querySelector('.last-infos-card-excerpt'),
      ).toHaveTextContent('AvantAprès');
    });

    it('renders an empty excerpt without any content', () => {
      render(<LastInfos {...props({ content: '' })} />);

      expect(
        document.querySelector('.last-infos-card-excerpt'),
      ).toBeEmptyDOMElement();
      expect(medias()).toHaveLength(0);
    });

    it('ignores an image carrying no source', () => {
      render(
        <LastInfos {...props({ content: '<p>Texte</p><img src="  " />' })} />,
      );

      expect(medias()).toHaveLength(0);
    });
  });

  describe('media previews', () => {
    it('renders no media block without an image', () => {
      render(<LastInfos {...props()} />);

      expect(document.querySelector('.last-infos-card-medias')).toBeNull();
    });

    it('previews up to three images', () => {
      render(
        <LastInfos
          {...props({
            content: '<img src="/a.png" /><img src="/b.png" />',
          })}
        />,
      );

      expect(medias()).toHaveLength(2);
      expect(
        document.querySelector('.last-infos-card-media-overlay'),
      ).toBeNull();
    });

    it('counts the extra images in an overlay on the third preview', () => {
      render(
        <LastInfos
          {...props({
            content:
              '<img src="/a.png" /><img src="/b.png" /><img src="/c.png" /><img src="/d.png" /><img src="/e.png" />',
          })}
        />,
      );

      expect(medias()).toHaveLength(3);
      expect(
        document.querySelector('.last-infos-card-media-overlay'),
      ).toHaveTextContent('+2');
    });

    it('shows no overlay when exactly three images are available', () => {
      render(
        <LastInfos
          {...props({
            content:
              '<img src="/a.png" /><img src="/b.png" /><img src="/c.png" />',
          })}
        />,
      );

      expect(medias()).toHaveLength(3);
      expect(
        document.querySelector('.last-infos-card-media-overlay'),
      ).toBeNull();
    });
  });

  describe('interaction', () => {
    it('renders no action button without a callback', () => {
      render(<LastInfos {...props()} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(card()).not.toHaveClass('last-infos-card-clickable');
    });

    it('exposes a labelled action button calling back with the ids', async () => {
      const onClick = vi.fn();
      const { user } = render(<LastInfos {...props({ onClick })} />);

      const button = screen.getByRole('button', {
        name: 'Informations importantes - Rentrée scolaire',
      });
      await user.click(button);

      expect(onClick).toHaveBeenCalledWith(7, 42);
      expect(card()).toHaveClass('last-infos-card-clickable');
    });
  });

  describe('headline', () => {
    it('is not highlighted by default', () => {
      render(<LastInfos {...props()} />);

      expect(card()).not.toHaveClass('last-infos-card-headline');
    });

    it('is highlighted when flagged as headline', () => {
      render(<LastInfos {...props({ isHeadline: true })} />);

      expect(card()).toHaveClass('last-infos-card-headline');
    });
  });
});
