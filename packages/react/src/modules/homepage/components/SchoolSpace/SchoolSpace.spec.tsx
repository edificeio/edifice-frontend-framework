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

  it('opens the school list when the school name is clicked', async () => {
    const { user } = render(
      <SchoolSpace
        selectedSchool={mockSchool1}
        schools={[mockSchool1, mockSchool2]}
      />,
    );

    const trigger = screen.getByRole('button', { name: mockSchool1.name });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByText(mockSchool1.name, { selector: 'b' }));

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(mockSchool2.name)).toBeInTheDocument();
  });

  it('opens the school list when the chevron is clicked and selects a school', async () => {
    const onSelectedSchoolChange = vi.fn();
    const { user, container } = render(
      <SchoolSpace
        selectedSchool={mockSchool1}
        schools={[mockSchool1, mockSchool2]}
        onSelectedSchoolChange={onSelectedSchoolChange}
      />,
    );

    await user.click(
      container.querySelector('.school-space-trigger-icon') as Element,
    );
    await user.click(screen.getByText(mockSchool2.name));

    expect(onSelectedSchoolChange).toHaveBeenCalledWith(mockSchool2);
  });

  it('does not render a trigger when there is a single school', () => {
    render(
      <SchoolSpace selectedSchool={mockSchool1} schools={[mockSchool1]} />,
    );

    expect(
      screen.queryByRole('button', { name: mockSchool1.name }),
    ).not.toBeInTheDocument();
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
