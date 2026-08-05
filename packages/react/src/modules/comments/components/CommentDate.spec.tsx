import { render, screen } from '~/setup';
import { CommentDate } from './CommentDate';

const A_MINUTE_AGO = () => Date.now() - 60_000;

describe('CommentDate', () => {
  it('shows the publication date of a comment never edited', () => {
    render(<CommentDate createdAt={A_MINUTE_AGO()} updatedAt={undefined} />);

    expect(screen.getByTestId('comment-info-date').textContent).toMatch(
      /^Published /,
    );
  });

  it('shows the edition date once the comment has been edited', () => {
    render(<CommentDate createdAt={1000} updatedAt={A_MINUTE_AGO()} />);

    expect(screen.getByTestId('comment-info-date').textContent).toMatch(
      /^Modified /,
    );
  });

  it('renders a separator alongside the date', () => {
    render(<CommentDate createdAt={A_MINUTE_AGO()} updatedAt={undefined} />);

    expect(screen.getByText('|')).toBeInTheDocument();
  });

  it('renders nothing without any date', () => {
    render(<CommentDate createdAt={0} updatedAt={undefined} />);

    expect(screen.queryByTestId('comment-info-date')).not.toBeInTheDocument();
  });

  it('renders nothing when both dates are zero', () => {
    render(<CommentDate createdAt={0} updatedAt={0} />);

    expect(screen.queryByTestId('comment-info-date')).not.toBeInTheDocument();
  });
});
