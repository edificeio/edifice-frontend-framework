import { act, renderHook } from '~/setup';
import { CommentProps } from '../types';
import { useCommentReplies } from './useCommentReplies';

const { useCommentsContext, useEdificeClient } = vi.hoisted(() => ({
  useCommentsContext: vi.fn(),
  useEdificeClient: vi.fn(),
}));

vi.mock('./useCommentsContext', () => ({ useCommentsContext }));

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

const parent = comment({ id: 'parent' });

function setup({
  defaultComments = [],
  replyToCommentId = null,
  maxReplies = 2,
  additionalReplies = 2,
  parentComment = parent,
}: {
  defaultComments?: CommentProps[];
  replyToCommentId?: string | null;
  maxReplies?: number;
  additionalReplies?: number;
  parentComment?: CommentProps;
} = {}) {
  useCommentsContext.mockReturnValue({
    profiles: [{ userId: 'author-1', profile: 'Teacher' }],
    options: { maxReplies, additionalReplies },
    replyToCommentId,
    defaultComments,
  });

  return renderHook(() => useCommentReplies({ parentComment }));
}

const ids = (comments: CommentProps[]) => comments.map(({ id }) => id);

describe('useCommentReplies', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ user: { userId: 'user-1' } });
  });

  describe('displayed replies', () => {
    it('keeps only the replies of the parent comment', () => {
      const { result } = setup({
        defaultComments: [
          comment({ id: 'r1', replyTo: 'parent' }),
          comment({ id: 'other', replyTo: 'another-parent' }),
          comment({ id: 'top-level' }),
        ],
      });

      expect(ids(result.current.displayedReplies)).toEqual(['r1']);
    });

    it('sorts the replies from the oldest to the most recent', () => {
      const { result } = setup({
        maxReplies: 5,
        defaultComments: [
          comment({ id: 'recent', replyTo: 'parent', createdAt: 3 }),
          comment({ id: 'old', replyTo: 'parent', createdAt: 1 }),
          comment({ id: 'middle', replyTo: 'parent', createdAt: 2 }),
        ],
      });

      expect(ids(result.current.displayedReplies)).toEqual([
        'old',
        'middle',
        'recent',
      ]);
    });

    it('drops the deleted replies', () => {
      const { result } = setup({
        defaultComments: [
          comment({ id: 'kept', replyTo: 'parent' }),
          comment({ id: 'gone', replyTo: 'parent', deleted: true }),
        ],
      });

      expect(ids(result.current.displayedReplies)).toEqual(['kept']);
    });

    it('caps the list at the configured maximum', () => {
      const { result } = setup({
        maxReplies: 1,
        defaultComments: [
          comment({ id: 'r1', replyTo: 'parent', createdAt: 1 }),
          comment({ id: 'r2', replyTo: 'parent', createdAt: 2 }),
        ],
      });

      expect(ids(result.current.displayedReplies)).toEqual(['r1']);
      expect(result.current.showMoreReplies).toBe(true);
    });

    it('reports no further replies when everything is displayed', () => {
      const { result } = setup({
        defaultComments: [comment({ id: 'r1', replyTo: 'parent' })],
      });

      expect(result.current.showMoreReplies).toBe(false);
    });

    it('handles an undefined comment list', () => {
      const { result } = setup({ defaultComments: undefined });

      expect(result.current.displayedReplies).toEqual([]);
      expect(result.current.showMoreReplies).toBe(false);
    });
  });

  describe('handleMoreReplies', () => {
    it('extends the page by the configured increment', async () => {
      const { result } = setup({
        maxReplies: 1,
        additionalReplies: 2,
        defaultComments: [
          comment({ id: 'r1', replyTo: 'parent', createdAt: 1 }),
          comment({ id: 'r2', replyTo: 'parent', createdAt: 2 }),
          comment({ id: 'r3', replyTo: 'parent', createdAt: 3 }),
        ],
      });

      await act(() => result.current.handleMoreReplies());

      expect(ids(result.current.displayedReplies)).toEqual(['r1', 'r2', 'r3']);
      expect(result.current.showMoreReplies).toBe(false);
    });

    it('falls back to two more replies without an explicit increment', async () => {
      const { result } = setup({
        maxReplies: 1,
        additionalReplies: undefined,
        defaultComments: Array.from({ length: 5 }, (_, index) =>
          comment({ id: `r${index}`, replyTo: 'parent', createdAt: index }),
        ),
      });

      await act(() => result.current.handleMoreReplies());

      expect(result.current.displayedReplies).toHaveLength(3);
    });
  });

  describe('reply form', () => {
    it('opens for the comment being replied to', () => {
      const { result } = setup({ replyToCommentId: 'parent' });

      expect(result.current.showCommentForm).toBe(true);
    });

    it('stays closed for another comment', () => {
      const { result } = setup({ replyToCommentId: 'another-comment' });

      expect(result.current.showCommentForm).toBe(false);
    });

    it('stays closed on a deleted comment', () => {
      const { result } = setup({
        replyToCommentId: 'parent',
        parentComment: comment({ id: 'parent', deleted: true }),
      });

      expect(result.current.showCommentForm).toBe(false);
    });
  });

  it('forwards the profiles from the context and the session user', () => {
    const { result } = setup();

    expect(result.current.profiles).toEqual([
      { userId: 'author-1', profile: 'Teacher' },
    ]);
    expect(result.current.user).toEqual({ userId: 'user-1' });
  });
});
