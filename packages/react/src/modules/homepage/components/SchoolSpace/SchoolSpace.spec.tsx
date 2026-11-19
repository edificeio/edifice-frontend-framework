import { render, screen } from '~/setup';
import SchoolSpace from './SchoolSpace';

import {
  mockSchool1,
  mockSchool2,
} from '../../../../../../config/src/msw/data/schoolSpace';

describe('SchoolSpace', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  it('renders nothing when no school is selected', () => {
    const { container } = render(<SchoolSpace selectedSchool={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a directory button pointing to the selected school', () => {
    render(<SchoolSpace selectedSchool={mockSchool1} />);

    expect(
      screen.getByRole('button', { name: 'Annuaire' }),
    ).toBeInTheDocument();
  });

  it('navigates to the directory of the selected school when clicked', async () => {
    const { user } = render(<SchoolSpace selectedSchool={mockSchool1} />);

    await user.click(screen.getByRole('button', { name: 'Annuaire' }));

    expect(window.location.href).toBe(
      '/userbook/annuaire#/search?structure=school-1',
    );
  });

  it('updates the directory link when the selected school changes', async () => {
    const { user, rerender } = render(
      <SchoolSpace
        selectedSchool={mockSchool1}
        schools={[mockSchool1, mockSchool2]}
      />,
    );

    rerender(
      <SchoolSpace
        selectedSchool={mockSchool2}
        schools={[mockSchool1, mockSchool2]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Annuaire' }));

    expect(window.location.href).toBe(
      '/userbook/annuaire#/search?structure=school-2',
    );
  });

  describe('while loading', () => {
    it('announces a single loading region, even without a selected school', () => {
      render(<SchoolSpace selectedSchool={undefined} isLoading />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-busy', 'true');
      expect(status).toHaveTextContent('Loading');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('reserves two lines for the school name', () => {
      render(<SchoolSpace selectedSchool={undefined} isLoading />);

      expect(
        document.querySelectorAll('.school-space__line-skeleton'),
      ).toHaveLength(2);
    });
  });
});
