import { render, screen } from '~/setup';
import useTitle from './useTitle';

function HookHost() {
  const title = useTitle();

  return <span>{title}</span>;
}

describe('useTitle', () => {
  let initialTitle = '';

  beforeEach(() => {
    initialTitle = document.title;
  });

  afterEach(() => {
    document.title = initialTitle;
  });

  it('returns the current document.title', () => {
    document.title = 'My first title';

    render(<HookHost />);

    expect(screen.getByText('My first title')).toBeInTheDocument();
  });

  it('syncs with the latest document.title on a new mount', () => {
    document.title = 'Title A';
    const { unmount } = render(<HookHost />);

    expect(screen.getByText('Title A')).toBeInTheDocument();

    unmount();
    document.title = 'Title B';

    render(<HookHost />);

    expect(screen.getByText('Title B')).toBeInTheDocument();
  });
});
