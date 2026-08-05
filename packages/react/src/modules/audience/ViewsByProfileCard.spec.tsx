import { ViewsDetailsProfile } from '@edifice.io/client';
import { render, screen } from '~/setup';
import ViewsByProfileCard from './ViewsByProfileCard';

const viewsByProfile = (profile: string, counter = 3): ViewsDetailsProfile =>
  ({ profile, counter }) as unknown as ViewsDetailsProfile;

describe('ViewsByProfileCard', () => {
  it('displays the counter of the profile', () => {
    render(
      <ViewsByProfileCard viewsByProfile={viewsByProfile('Student', 8)} />,
    );

    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('labels the line with the translated profile', () => {
    render(<ViewsByProfileCard viewsByProfile={viewsByProfile('Student')} />);

    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  it('falls back to the raw key for a profile with no translation', () => {
    render(<ViewsByProfileCard viewsByProfile={viewsByProfile('Alien')} />);

    expect(
      screen.getByText('audience.views.uniqueViewsPerProfile.alien'),
    ).toBeInTheDocument();
  });

  it.each(['Student', 'Relative', 'Teacher', 'Personnel', 'Guest'])(
    'renders the dedicated icon and modifier class for %s',
    (profile) => {
      render(<ViewsByProfileCard viewsByProfile={viewsByProfile(profile)} />);

      expect(
        document.querySelector(
          `.views-detail-icon-${profile.toLowerCase()} svg`,
        ),
      ).not.toBeNull();
    },
  );

  it('falls back to the generic users icon for an unknown profile', () => {
    render(<ViewsByProfileCard viewsByProfile={viewsByProfile('Alien')} />);

    expect(
      document.querySelector('.views-detail-icon-alien svg'),
    ).not.toBeNull();
  });

  it('renders a different icon for a known profile and for the fallback', () => {
    const { container: known, unmount } = render(
      <ViewsByProfileCard viewsByProfile={viewsByProfile('Student')} />,
    );
    const knownMarkup = known.querySelector('.views-detail-icon')?.innerHTML;
    unmount();

    const { container: unknown } = render(
      <ViewsByProfileCard viewsByProfile={viewsByProfile('Alien')} />,
    );

    expect(unknown.querySelector('.views-detail-icon')?.innerHTML).not.toBe(
      knownMarkup,
    );
  });
});
