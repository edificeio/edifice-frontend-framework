import { render, screen } from '~/setup';
import { LastInfosList } from './LastInfosList';

describe('LastInfosList', () => {
  describe('while loading', () => {
    it('announces a single loading region instead of the infos', () => {
      render(<LastInfosList infos={[]} isLoading />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-busy', 'true');
      expect(status).toHaveTextContent('Loading');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('keeps the header and shows four placeholder cards, two with images', () => {
      render(<LastInfosList infos={[]} isLoading />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(
        document.querySelectorAll('.last-infos-card--skeleton'),
      ).toHaveLength(4);
      expect(
        document.querySelectorAll('.last-infos-card__media-skeleton'),
      ).toHaveLength(2);
    });
  });
});
