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

  const renderWithSchools = () => {
    const onSelectedSchoolChange = vi.fn();
    const utils = render(
      <SchoolSpace
        selectedSchool={mockSchool1}
        schools={[mockSchool1, mockSchool2]}
        onSelectedSchoolChange={onSelectedSchoolChange}
      />,
    );
    const trigger = screen.getByRole('button', {
      name: `${mockSchool1.name} Changer d’établissement`,
    });
    const chevron = screen.getByTestId('homepage-school-space-chevron');
    return { ...utils, onSelectedSchoolChange, trigger, chevron };
  };

  it('exposes the school name and the action as the trigger name', () => {
    const { trigger } = renderWithSchools();

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the school list when the school name is clicked', async () => {
    const { user, trigger } = renderWithSchools();

    await user.click(screen.getByText(mockSchool1.name, { selector: 'b' }));

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(mockSchool2.name)).toBeInTheDocument();
  });

  it('opens the school list when the chevron is clicked and selects a school', async () => {
    const { user, chevron, onSelectedSchoolChange } = renderWithSchools();

    await user.click(chevron);
    await user.click(screen.getByText(mockSchool2.name));

    expect(onSelectedSchoolChange).toHaveBeenCalledWith(mockSchool2);
  });

  it('points the chevron down when closed and up when open', async () => {
    const { user, trigger, chevron } = renderWithSchools();

    expect(chevron.style.rotate).toBe('180deg');

    await user.click(trigger);
    expect(chevron.style.rotate).toBe('0deg');

    await user.click(trigger);
    expect(chevron.style.rotate).toBe('180deg');
  });

  it('opens with the keyboard and selects a school with Enter', async () => {
    const { user, trigger, onSelectedSchoolChange } = renderWithSchools();

    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onSelectedSchoolChange).toHaveBeenCalledWith(mockSchool2);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape and gives the focus back to the trigger', async () => {
    const { user, trigger } = renderWithSchools();

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('does not render a dropdown trigger when there is a single school', () => {
    const { container } = render(
      <SchoolSpace selectedSchool={mockSchool1} schools={[mockSchool1]} />,
    );

    expect(screen.getByText(mockSchool1.name)).toBeInTheDocument();
    expect(container.querySelector('[aria-haspopup]')).toBeNull();
    expect(
      screen.queryByTestId('homepage-school-space-chevron'),
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
