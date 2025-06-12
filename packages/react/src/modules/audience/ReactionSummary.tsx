import { ReactionSummaryData } from '@edifice.io/client';
import { StringUtils } from '@edifice.io/utilities';
import { Button } from '../../components';
import { default as useReactionIcons } from './hooks/useReactionIcons';

/**
 * Props for the ReactionSummary component.
 */
export interface ReactionSummaryProps {
  /**
   * An optional summary of reaction data.
   */
  summary?: ReactionSummaryData;

  /**
   * An optional click handler function.
   */
  onClick?: () => void;
}

const ReactionSummary = ({
  summary = { userReaction: null, totalReactionsCounter: 0 },
  onClick,
}: ReactionSummaryProps) => {
  const { getReactionIcon } = useReactionIcons();

  const { totalReactionsCounter, reactionTypes } = summary;

  const hasNoReactions = totalReactionsCounter === 0;

  const handleDetailsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.();
  };

  return (
    <Button
      variant="ghost"
      className="py-4 px-8 btn-icon"
      disabled={hasNoReactions}
      onClick={handleDetailsClick}
    >
      <div className="d-flex align-items-center">
        <div className="text-gray-700 fw-normal me-8">
          {StringUtils.toCounter(totalReactionsCounter)}
        </div>
        {hasNoReactions ? (
          <div className="reaction-overlap">
            {getReactionIcon('REACTION_1', true)}
          </div>
        ) : (
          reactionTypes?.map((reactionType) => (
            <div className="reaction-overlap" key={reactionType}>
              {getReactionIcon(reactionType, true)}
            </div>
          ))
        )}
      </div>
    </Button>
  );
};

ReactionSummary.displayName = 'ReactionSummary';

export default ReactionSummary;
