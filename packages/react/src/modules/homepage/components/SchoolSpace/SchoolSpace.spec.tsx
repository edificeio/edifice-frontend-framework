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
});
