import { UserProfile } from '@edifice.io/client';
import { render, screen } from '~/setup';
import { CommentProps } from '../types';
import { Comment } from './Comment';

const { useCommentsContext } = vi.hoisted(() => ({
  useCommentsContext: vi.fn(),
}));

vi.mock('../hooks/useCommentsContext', () => ({ useCommentsContext }));

// The replies block has its own spec; here it only needs to be identifiable.
vi.mock('./CommentReplies', () => ({
  CommentReplies: () => <div data-testid="comment-replies" />,
}));

vi.mock('./CommentAvatar', () => ({
  CommentAvatar: ({ id }: { id: string }) => (
    <div data-testid={`avatar-${id}`} />
  ),
}));

function comment(
  partial: Partial<CommentProps> & { id: string },
): CommentProps {
  return {
    comment: `content ${partial.id}`,
    authorId: 'author-1',
    authorName: 'Author One',
    createdAt: Date.now() - 60_000,
    ...partial,
  };
}

type ContextOverrides = {
  defaultComments?: CommentProps[];
  editCommentId?: string | null;
  type?: 'edit' | 'read';
  userRights?: { manager?: boolean };
  allowReplies?: boolean;
};

function setup({
  target = comment({ id: 'c1' }),
  userId = 'author-1',
  ...overrides
}: ContextOverrides & { target?: CommentProps; userId?: string } = {}) {
  const handlers = {
    handleDeleteComment: vi.fn(),
    handleModifyComment: vi.fn(),
    handleReset: vi.fn(),
    handleUpdateComment: vi.fn(),
    handleReplyToComment: vi.fn(),
  };

  useCommentsContext.mockReturnValue({
    defaultComments: overrides.defaultComments ?? [target],
    editCommentId: overrides.editCommentId ?? null,
    options: {
      maxCommentLength: 200,
      allowReplies: overrides.allowReplies ?? true,
    },
    type: overrides.type ?? 'edit',
    userRights: overrides.userRights ?? {},
    ...handlers,
  });

  return {
    ...render(
      <Comment
        comment={target}
        userId={userId}
        profile={'Teacher' as UserProfile[number]}
      />,
    ),
    handlers,
  };
}

describe('Comment', () => {
  describe('reading a comment', () => {
    it('shows the author, the content and the replies block', () => {
      setup();

      expect(screen.getByText('Author One')).toBeInTheDocument();
      expect(screen.getByText('content c1')).toBeInTheDocument();
      expect(screen.getByTestId('comment-replies')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-author-1')).toBeInTheDocument();
    });

    it('offers reply, edit and remove to the author in edit mode', () => {
      setup();

      expect(screen.getByText('Reply')).toBeInTheDocument();
      expect(screen.getByTestId('comment-edit')).toBeInTheDocument();
      expect(screen.getByTestId('comment-delete')).toBeInTheDocument();
    });

    it('offers no action at all in read mode', () => {
      setup({ type: 'read' });

      expect(screen.queryByText('Reply')).not.toBeInTheDocument();
      expect(screen.queryByTestId('comment-edit')).not.toBeInTheDocument();
      expect(screen.queryByTestId('comment-delete')).not.toBeInTheDocument();
    });

    it('hides edit and remove from another user', () => {
      setup({ userId: 'someone-else' });

      expect(screen.queryByTestId('comment-edit')).not.toBeInTheDocument();
      expect(screen.queryByTestId('comment-delete')).not.toBeInTheDocument();
    });

    it('still allows a manager to remove someone else comment', () => {
      setup({ userId: 'someone-else', userRights: { manager: true } });

      expect(screen.queryByTestId('comment-edit')).not.toBeInTheDocument();
      expect(screen.getByTestId('comment-delete')).toBeInTheDocument();
    });

    it('hides the reply button on a reply', () => {
      setup({ target: comment({ id: 'c1', replyTo: 'parent' }) });

      expect(screen.queryByText('Reply')).not.toBeInTheDocument();
    });

    it('hides the reply button when replies are disabled', () => {
      setup({ allowReplies: false });

      expect(screen.queryByText('Reply')).not.toBeInTheDocument();
    });

    it('asks to reply to this comment', async () => {
      const { user, handlers } = setup();

      await user.click(screen.getByText('Reply'));

      expect(handlers.handleReplyToComment).toHaveBeenCalledWith('c1');
    });
  });

  describe('deleted comment', () => {
    it('shows the deleted placeholder and the replies when a reply survives', () => {
      const target = comment({ id: 'c1', deleted: true });

      setup({
        target,
        defaultComments: [target, comment({ id: 'r1', replyTo: 'c1' })],
      });

      expect(screen.getByTestId('comment-replies')).toBeInTheDocument();
      expect(screen.queryByTestId('div-comment-read')).not.toBeInTheDocument();
    });

    it('shows nothing when every reply is deleted too', () => {
      const target = comment({ id: 'c1', deleted: true });

      setup({
        target,
        defaultComments: [
          target,
          comment({ id: 'r1', replyTo: 'c1', deleted: true }),
        ],
      });

      expect(screen.queryByTestId('comment-replies')).not.toBeInTheDocument();
      expect(screen.queryByTestId('div-comment-read')).not.toBeInTheDocument();
    });

    it('shows nothing when the deleted comment has no reply', () => {
      const target = comment({ id: 'c1', deleted: true });

      setup({ target, defaultComments: [target] });

      expect(screen.queryByTestId('comment-replies')).not.toBeInTheDocument();
    });
  });

  describe('editing a comment', () => {
    it('switches to a textarea prefilled by the edit action', async () => {
      const target = comment({ id: 'c1' });
      const { user, handlers } = setup({ target });

      await user.click(screen.getByTestId('comment-edit'));

      expect(handlers.handleModifyComment).toHaveBeenCalledWith('c1');
    });

    it('renders the edition form for the comment being edited', () => {
      setup({ editCommentId: 'c1' });

      const textarea = screen.getByPlaceholderText('Your comment');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('maxlength', '200');
      expect(screen.getByTestId('comment-save')).toBeInTheDocument();
    });

    it('highlights the comment being edited', () => {
      setup({ editCommentId: 'c1' });

      expect(screen.getByTestId('div-comment-read')).toHaveClass('bg-gray-200');
    });

    it('saves the edited content', async () => {
      const { user, handlers } = setup({ editCommentId: 'c1' });

      await user.type(
        screen.getByPlaceholderText('Your comment'),
        'nouveau contenu',
      );
      await user.click(screen.getByTestId('comment-save'));

      expect(handlers.handleUpdateComment).toHaveBeenCalledWith(
        'nouveau contenu',
      );
    });

    it('cancels the edition', async () => {
      const { user, handlers } = setup({ editCommentId: 'c1' });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(handlers.handleReset).toHaveBeenCalledTimes(1);
    });

    it('counts the typed characters against the maximum', async () => {
      const { user } = setup({ editCommentId: 'c1' });

      await user.type(screen.getByPlaceholderText('Your comment'), 'abc');

      expect(screen.getByText('3 / 200')).toBeInTheDocument();
    });
  });

  describe('deletion modal', () => {
    it('opens on the remove button and deletes on confirmation', async () => {
      const { user, handlers } = setup();

      await user.click(screen.getByTestId('comment-delete'));

      const confirm = await screen.findByText('comment.delete.modal.delete');
      await user.click(confirm);

      expect(handlers.handleDeleteComment).toHaveBeenCalledWith('c1');
    });

    it('closes without deleting on cancellation', async () => {
      const { user, handlers } = setup();

      await user.click(screen.getByTestId('comment-delete'));
      await user.click(await screen.findByRole('button', { name: 'Cancel' }));

      expect(handlers.handleDeleteComment).not.toHaveBeenCalled();
    });
  });
});
