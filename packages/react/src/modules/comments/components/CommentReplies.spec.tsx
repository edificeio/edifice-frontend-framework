import { render, screen } from '~/setup';
import { CommentProps } from '../types';
import { CommentReplies } from './CommentReplies';

const { useCommentReplies } = vi.hoisted(() => ({
  useCommentReplies: vi.fn(),
}));

vi.mock('../hooks/useCommentReplies', () => ({ useCommentReplies }));

// Both children are covered by their own specs.
vi.mock('./Comment', () => ({
  Comment: ({
    comment,
    profile,
    userId,
  }: {
    comment: CommentProps;
    profile: string;
    userId: string;
  }) => (
    <div data-testid={`reply-${comment.id}`} data-profile={profile}>
      {userId}
    </div>
  ),
}));

vi.mock('./CommentForm', () => ({
  CommentForm: ({ replyTo }: { replyTo?: string }) => (
    <div data-testid={`reply-form-${replyTo}`} />
  ),
}));

function comment(
  partial: Partial<CommentProps> & { id: string },
): CommentProps {
  return {
    comment: `content ${partial.id}`,
    authorId: 'author-1',
    authorName: 'Author One',
    createdAt: 1000,
    ...partial,
  };
}

const parent = comment({ id: 'parent' });

function setup(
  options: {
    displayedReplies?: CommentProps[];
    showCommentForm?: boolean;
    showMoreReplies?: boolean;
    profiles?: ({ userId: string; profile: string } | undefined)[];
  } = {},
) {
  const {
    displayedReplies = [],
    showCommentForm = false,
    showMoreReplies = false,
  } = options;
  // An explicit `profiles: undefined` must survive, hence the key check.
  const profiles =
    'profiles' in options
      ? options.profiles
      : [{ userId: 'author-1', profile: 'Teacher' }];
  const handleMoreReplies = vi.fn();

  useCommentReplies.mockReturnValue({
    t: (key: string) => key,
    profiles,
    user: { userId: 'user-1' },
    displayedReplies,
    showCommentForm,
    showMoreReplies,
    handleMoreReplies,
  });

  return {
    ...render(<CommentReplies parentComment={parent} />),
    handleMoreReplies,
  };
}

describe('CommentReplies', () => {
  it('renders the reply form for the comment being replied to', () => {
    setup({ showCommentForm: true });

    expect(screen.getByTestId('reply-form-parent')).toBeInTheDocument();
  });

  it('renders no reply form otherwise', () => {
    setup();

    expect(screen.queryByTestId('reply-form-parent')).not.toBeInTheDocument();
  });

  it('renders one comment per displayed reply', () => {
    setup({
      displayedReplies: [
        comment({ id: 'r1', replyTo: 'parent' }),
        comment({ id: 'r2', replyTo: 'parent' }),
      ],
    });

    expect(screen.getByTestId('reply-r1')).toBeInTheDocument();
    expect(screen.getByTestId('reply-r2')).toBeInTheDocument();
  });

  it('passes the author profile down to each reply', () => {
    setup({
      displayedReplies: [comment({ id: 'r1', authorId: 'author-1' })],
    });

    expect(screen.getByTestId('reply-r1')).toHaveAttribute(
      'data-profile',
      'Teacher',
    );
  });

  it('falls back to the guest profile for an unknown author', () => {
    setup({
      displayedReplies: [comment({ id: 'r1', authorId: 'unknown-author' })],
    });

    expect(screen.getByTestId('reply-r1')).toHaveAttribute(
      'data-profile',
      'Guest',
    );
  });

  it('falls back to the guest profile when the profiles are not loaded', () => {
    setup({
      profiles: undefined,
      displayedReplies: [comment({ id: 'r1' })],
    });

    expect(screen.getByTestId('reply-r1')).toHaveAttribute(
      'data-profile',
      'Guest',
    );
  });

  it('skips a deleted reply', () => {
    setup({
      displayedReplies: [
        comment({ id: 'r1' }),
        comment({ id: 'r2', deleted: true }),
      ],
    });

    expect(screen.getByTestId('reply-r1')).toBeInTheDocument();
    expect(screen.queryByTestId('reply-r2')).not.toBeInTheDocument();
  });

  it('offers to load more replies', async () => {
    const { user, handleMoreReplies } = setup({ showMoreReplies: true });

    await user.click(screen.getByText('comment.more.replies'));

    expect(handleMoreReplies).toHaveBeenCalledTimes(1);
  });

  it('hides the load-more button when everything is displayed', () => {
    setup();

    expect(screen.queryByText('comment.more.replies')).not.toBeInTheDocument();
  });
});
