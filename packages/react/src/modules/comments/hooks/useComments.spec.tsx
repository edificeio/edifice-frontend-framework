import { act, renderHook } from '~/setup';
import { CommentCallbacks, CommentOptions, CommentProps } from '../types';
import { useComments } from './useComments';

const { useProfileQueries, useEdificeClient } = vi.hoisted(() => ({
  useProfileQueries: vi.fn(),
  useEdificeClient: vi.fn(),
}));

vi.mock('./useProfileQueries', () => ({ useProfileQueries }));

vi.mock(
  '../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({ useEdificeClient }),
);

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

const options: CommentOptions = {
  maxComments: 2,
  additionalComments: 2,
  maxReplies: 2,
  additionalReplies: 2,
};

function setup({
  defaultComments,
  type = 'edit',
  overrides = {},
}: {
  defaultComments?: CommentProps[];
  type?: 'edit' | 'read';
  overrides?: Partial<CommentOptions>;
} = {}) {
  const callbacks: CommentCallbacks = {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  const { result } = renderHook(() =>
    useComments({
      defaultComments,
      options: { ...options, ...overrides },
      type,
      callbacks,
    }),
  );

  return { result, callbacks };
}

const ids = (comments: CommentProps[]) => comments.map(({ id }) => id);

describe('useComments', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ user: { userId: 'user-1' } });
    useProfileQueries.mockReturnValue({ data: [], isLoading: false });
  });

  describe('displayed comments', () => {
    it('sorts the comments from the most recent to the oldest', () => {
      const { result } = setup({
        type: 'read',
        defaultComments: [
          comment({ id: 'old', createdAt: 1 }),
          comment({ id: 'recent', createdAt: 3 }),
          comment({ id: 'middle', createdAt: 2 }),
        ],
      });

      expect(ids(result.current.displayedComments)).toEqual([
        'recent',
        'middle',
        'old',
      ]);
    });

    it('leaves the replies out of the top-level list', () => {
      const { result } = setup({
        type: 'read',
        defaultComments: [
          comment({ id: 'parent' }),
          comment({ id: 'reply', replyTo: 'parent' }),
        ],
      });

      expect(ids(result.current.displayedComments)).toEqual(['parent']);
    });

    it('drops a deleted comment that carries no reply', () => {
      const { result } = setup({
        type: 'read',
        defaultComments: [
          comment({ id: 'kept' }),
          comment({ id: 'gone', deleted: true }),
        ],
      });

      expect(ids(result.current.displayedComments)).toEqual(['kept']);
    });

    it('keeps a deleted comment whose thread still holds a reply', () => {
      const { result } = setup({
        type: 'read',
        defaultComments: [
          comment({ id: 'deleted-parent', deleted: true }),
          comment({ id: 'reply', replyTo: 'deleted-parent' }),
        ],
      });

      expect(ids(result.current.displayedComments)).toEqual(['deleted-parent']);
    });

    it('paginates in edit mode only', () => {
      const three = [
        comment({ id: 'a', createdAt: 3 }),
        comment({ id: 'b', createdAt: 2 }),
        comment({ id: 'c', createdAt: 1 }),
      ];

      const edit = setup({ defaultComments: three });
      expect(ids(edit.result.current.displayedComments)).toEqual(['a', 'b']);
      expect(edit.result.current.showMoreComments).toBe(true);

      const read = setup({ type: 'read', defaultComments: three });
      expect(ids(read.result.current.displayedComments)).toEqual([
        'a',
        'b',
        'c',
      ]);
      expect(read.result.current.showMoreComments).toBe(false);
    });

    it('handles an undefined comment list', () => {
      const { result } = setup();

      expect(result.current.displayedComments).toEqual([]);
      expect(result.current.showMoreComments).toBe(false);
    });
  });

  describe('handleMoreComments', () => {
    it('extends the page by the configured increment', async () => {
      const { result } = setup({
        defaultComments: [
          comment({ id: 'a', createdAt: 4 }),
          comment({ id: 'b', createdAt: 3 }),
          comment({ id: 'c', createdAt: 2 }),
          comment({ id: 'd', createdAt: 1 }),
        ],
      });

      expect(result.current.displayedComments).toHaveLength(2);

      await act(() => result.current.handleMoreComments());

      expect(ids(result.current.displayedComments)).toEqual([
        'a',
        'b',
        'c',
        'd',
      ]);
      expect(result.current.showMoreComments).toBe(false);
    });

    it('falls back to five more comments without an explicit increment', async () => {
      const { result } = setup({
        defaultComments: Array.from({ length: 8 }, (_, index) =>
          comment({ id: `c${index}`, createdAt: 8 - index }),
        ),
        overrides: { additionalComments: undefined },
      });

      await act(() => result.current.handleMoreComments());

      expect(result.current.displayedComments).toHaveLength(7);
    });
  });

  describe('title', () => {
    it('uses the plural label beyond one comment', () => {
      const { result } = setup({
        defaultComments: [comment({ id: 'a' }), comment({ id: 'b' })],
      });

      expect(result.current.title).toBe('2 comments');
    });

    it('uses the singular label for one comment', () => {
      const { result } = setup({ defaultComments: [comment({ id: 'a' })] });

      expect(result.current.title).toBe('1 comment');
    });

    it('counts zero without any comment', () => {
      const { result } = setup();

      expect(result.current.title).toBe('0 comment');
    });

    it('leaves the deleted comments out of the count', () => {
      const { result } = setup({
        defaultComments: [
          comment({ id: 'a' }),
          comment({ id: 'b', deleted: true }),
        ],
      });

      expect(result.current.title).toBe('1 comment');
    });
  });

  describe('callbacks in edit mode', () => {
    it('deletes a comment', () => {
      const { result, callbacks } = setup();

      result.current.handleDeleteComment('comment-1');

      expect(callbacks.delete).toHaveBeenCalledWith('comment-1');
    });

    it('creates a comment', () => {
      const { result, callbacks } = setup();

      result.current.handleCreateComment('hello');

      expect(callbacks.post).toHaveBeenCalledWith('hello', undefined);
    });

    it('creates a reply and closes the reply form', async () => {
      const { result, callbacks } = setup();

      await act(() => result.current.handleReplyToComment('parent'));
      expect(result.current.replyToCommentId).toBe('parent');

      await act(() => result.current.handleCreateComment('hello', 'parent'));

      expect(callbacks.post).toHaveBeenCalledWith('hello', 'parent');
      expect(result.current.replyToCommentId).toBeNull();
    });

    it('updates the comment being edited and leaves edition', async () => {
      const { result, callbacks } = setup();

      await act(() => result.current.handleModifyComment('comment-1'));
      expect(result.current.editCommentId).toBe('comment-1');

      await act(() => result.current.handleUpdateComment('edited'));

      expect(callbacks.put).toHaveBeenCalledWith({
        comment: 'edited',
        commentId: 'comment-1',
      });
      expect(result.current.editCommentId).toBeNull();
    });

    it('ignores an update while no comment is being edited', async () => {
      const { result, callbacks } = setup();

      await act(() => result.current.handleUpdateComment('edited'));

      expect(callbacks.put).not.toHaveBeenCalled();
    });

    it('resets the edition state', async () => {
      const { result } = setup();

      await act(() => result.current.handleModifyComment('comment-1'));
      await act(() => result.current.handleReset());

      expect(result.current.editCommentId).toBeNull();
    });
  });

  describe('callbacks in read mode', () => {
    it('never calls the mutation callbacks', async () => {
      const { result, callbacks } = setup({ type: 'read' });

      await act(() => result.current.handleModifyComment('comment-1'));
      result.current.handleDeleteComment('comment-1');
      result.current.handleCreateComment('hello');
      await act(() => result.current.handleUpdateComment('edited'));

      expect(callbacks.delete).not.toHaveBeenCalled();
      expect(callbacks.post).not.toHaveBeenCalled();
      expect(callbacks.put).not.toHaveBeenCalled();
    });
  });

  describe('exposed data', () => {
    it('queries the profile of every distinct author', () => {
      setup({
        type: 'read',
        defaultComments: [
          comment({ id: 'a', authorId: 'author-1' }),
          comment({ id: 'b', authorId: 'author-2' }),
          comment({ id: 'c', authorId: 'author-1' }),
        ],
      });

      expect(useProfileQueries).toHaveBeenCalledWith(['author-1', 'author-2']);
    });

    it('forwards the session user and the empty-screen illustration', () => {
      const { result } = setup();

      expect(result.current.user).toEqual({ userId: 'user-1' });
      expect(result.current.emptyscreenPath).toBeTruthy();
    });
  });
});
