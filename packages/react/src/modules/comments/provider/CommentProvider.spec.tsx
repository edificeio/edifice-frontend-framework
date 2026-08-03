import { render, screen } from '~/setup';
import { CommentCallbacks, CommentProps, RootProps } from '../types';
import CommentProvider from './CommentProvider';

const { useProfileQueries, useEdificeClient } = vi.hoisted(() => ({
  useProfileQueries: vi.fn(),
  useEdificeClient: vi.fn(),
}));

vi.mock('../hooks/useProfileQueries', () => ({ useProfileQueries }));

vi.mock(
  '../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({ useEdificeClient }),
);

// Both children read the same context; only the provider is under test here.
vi.mock('../components/CommentForm', () => ({
  CommentForm: ({ userId }: { userId: string }) => (
    <div data-testid={`comment-form-${userId}`} />
  ),
}));

vi.mock('../components/CommentList', () => ({
  CommentList: () => <div data-testid="comment-list" />,
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

const callbacks: CommentCallbacks = {
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

function setup({
  comments = [],
  type = 'edit',
  options,
  isLoading = false,
}: {
  comments?: CommentProps[];
  type?: 'edit' | 'read';
  options?: Partial<RootProps['options']>;
  isLoading?: boolean;
} = {}) {
  useProfileQueries.mockReturnValue({ data: [], isLoading });

  const props = (
    type === 'edit'
      ? { type, comments, options, callbacks, rights: { manager: true } }
      : { type, comments, options }
  ) as RootProps;

  return render(<CommentProvider {...props} />);
}

describe('CommentProvider', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ user: { userId: 'user-1' } });
  });

  describe('heading', () => {
    it('counts the comments in the title', () => {
      setup({ comments: [comment({ id: 'a' }), comment({ id: 'b' })] });

      expect(screen.getByTestId('comments-info-count-text')).toHaveTextContent(
        '2 comments',
      );
    });

    it('hides the title from print when there is nothing to show', () => {
      setup();

      expect(screen.getByTestId('comments-info-count-text')).toHaveClass(
        'd-print-none',
      );
    });

    it('keeps the title on print once a comment exists', () => {
      setup({ comments: [comment({ id: 'a' })] });

      expect(screen.getByTestId('comments-info-count-text')).not.toHaveClass(
        'd-print-none',
      );
    });
  });

  describe('comment form', () => {
    it('renders the form for the session user', () => {
      setup();

      expect(screen.getByTestId('comment-form-user-1')).toBeInTheDocument();
    });

    it('renders no form while the user is unknown', () => {
      useEdificeClient.mockReturnValue({ user: undefined });

      setup();

      expect(
        screen.queryByTestId('comment-form-user-1'),
      ).not.toBeInTheDocument();
    });
  });

  describe('comment list', () => {
    it('waits for the author profiles before rendering the list', () => {
      setup({ isLoading: true });

      expect(screen.queryByTestId('comment-list')).not.toBeInTheDocument();
    });

    it('renders the list once the profiles are loaded', () => {
      setup();

      expect(screen.getByTestId('comment-list')).toBeInTheDocument();
    });

    it('offers a show-more button beyond the page size', async () => {
      const comments = Array.from({ length: 12 }, (_, index) =>
        comment({ id: `c${index}`, createdAt: index }),
      );

      const { user } = setup({ comments, options: { maxComments: 2 } });

      const more = screen.getByText('Read more');
      await user.click(more);

      expect(screen.getByTestId('comment-list')).toBeInTheDocument();
    });

    it('offers no show-more button when everything fits', () => {
      setup({ comments: [comment({ id: 'a' })] });

      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });
  });

  describe('empty screen', () => {
    it('invites the user to comment in edit mode', () => {
      setup();

      expect(
        screen.getByText('No comments yet, be the first to comment'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('.comments-emptyscreen'),
      ).toBeInTheDocument();
    });

    it('shows nothing in read mode', () => {
      setup({ type: 'read' });

      expect(
        screen.queryByText('No comments yet, be the first to comment'),
      ).not.toBeInTheDocument();
    });

    it('disappears as soon as a comment exists', () => {
      setup({ comments: [comment({ id: 'a' })] });

      expect(
        screen.queryByText('No comments yet, be the first to comment'),
      ).not.toBeInTheDocument();
    });
  });

  describe('options', () => {
    it('applies the default page size', () => {
      const comments = Array.from({ length: 12 }, (_, index) =>
        comment({ id: `c${index}`, createdAt: index }),
      );

      setup({ comments });

      // The default maximum is below twelve, so a show-more button is offered.
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });

    it('lets the caller override the page size', () => {
      const comments = Array.from({ length: 12 }, (_, index) =>
        comment({ id: `c${index}`, createdAt: index }),
      );

      setup({ comments, options: { maxComments: 20 } });

      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });
  });
});
