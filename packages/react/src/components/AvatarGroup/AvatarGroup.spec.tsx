import { render, screen } from '~/setup';
import AvatarGroup from './AvatarGroup';

const src = ['/a.png', '/b.png', '/c.png', '/d.png', '/e.png'];

describe('AvatarGroup', () => {
  it('renders one avatar per src, capped at the default maxAvatars (3)', () => {
    render(<AvatarGroup src={src} alt="Member" />);

    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByAltText('Member 1')).toHaveAttribute('src', '/a.png');
    expect(screen.getByAltText('Member 3')).toHaveAttribute('src', '/c.png');
    expect(screen.queryByAltText('Member 4')).not.toBeInTheDocument();
  });

  it('respects a custom maxAvatars', () => {
    render(<AvatarGroup src={src} alt="Member" maxAvatars={2} />);

    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('renders fewer avatars than maxAvatars when src is shorter', () => {
    render(
      <AvatarGroup src={['/a.png', '/b.png']} alt="Member" maxAvatars={5} />,
    );

    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('applies lastItemCover only to the last visible avatar', () => {
    render(
      <AvatarGroup
        src={src}
        alt="Member"
        maxAvatars={3}
        lastItemCover={<span>+2</span>}
      />,
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
    const thirdAvatar = screen.getByAltText('Member 3').closest('.avatar');
    expect(thirdAvatar).toHaveClass('avatar-with-cover');
    const firstAvatar = screen.getByAltText('Member 1').closest('.avatar');
    expect(firstAvatar).not.toHaveClass('avatar-with-cover');
  });
});
