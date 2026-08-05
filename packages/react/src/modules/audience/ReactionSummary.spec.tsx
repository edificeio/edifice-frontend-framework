import { ReactionSummaryData } from '@edifice.io/client';
import { render, screen } from '~/setup';
import ReactionSummary from './ReactionSummary';

function summary(
  partial: Partial<ReactionSummaryData> = {},
): ReactionSummaryData {
  return {
    userReaction: null,
    totalReactionsCounter: 0,
    ...partial,
  } as ReactionSummaryData;
}

const icons = () => document.querySelectorAll('.reaction-overlap');

describe('ReactionSummary', () => {
  it('displays the total number of reactions', () => {
    render(<ReactionSummary summary={summary({ totalReactionsCounter: 7 })} />);

    expect(screen.getByRole('button')).toHaveTextContent('7');
  });

  it('is disabled and shows a single placeholder icon without any reaction', () => {
    render(<ReactionSummary />);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(icons()).toHaveLength(1);
  });

  it('shows one icon per reaction type once there are reactions', () => {
    render(
      <ReactionSummary
        summary={summary({
          totalReactionsCounter: 5,
          reactionTypes: ['REACTION_1', 'REACTION_3'],
        })}
      />,
    );

    expect(icons()).toHaveLength(2);
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('shows no icon when the reaction types are missing', () => {
    render(<ReactionSummary summary={summary({ totalReactionsCounter: 5 })} />);

    expect(icons()).toHaveLength(0);
  });

  it('calls back on click', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <ReactionSummary
        summary={summary({
          totalReactionsCounter: 2,
          reactionTypes: ['REACTION_1'],
        })}
        onClick={onClick}
      />,
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not bubble the click up to a clickable parent', async () => {
    const onParentClick = vi.fn();
    const { user } = render(
      <div onClick={onParentClick}>
        <ReactionSummary
          summary={summary({
            totalReactionsCounter: 2,
            reactionTypes: ['REACTION_1'],
          })}
        />
      </div>,
    );

    await user.click(screen.getByRole('button'));

    expect(onParentClick).not.toHaveBeenCalled();
  });
});
