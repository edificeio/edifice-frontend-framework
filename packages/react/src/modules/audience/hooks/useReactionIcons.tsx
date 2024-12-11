import { ReactionType } from '@edifice.io/client';
import { IconReaction } from '../../icons/components';
import {
  IconCongrats,
  IconCongratsCounter,
  IconGreat,
  IconGreatCounter,
  IconInteresting,
  IconInterestingCounter,
  IconThanks,
  IconThanksCounter,
} from '../../icons/components/audience';

export default function useReactionIcons() {
  /**
   * Get the Icon corresponding to a ReactionType.
   *
   * @param reactionType type
   * @param asCounter Get the "counter / rounded" version of the icon ?
   * @returns An icon for the type, or <ReactionIcon /> by default.
   */
  const getReactionIcon = (
    reactionType?: ReactionType | null,
    asCounter?: boolean,
  ) => {
    switch (reactionType) {
      case 'REACTION_1':
        return asCounter ? <IconThanksCounter /> : <IconThanks />;
      case 'REACTION_2':
        return asCounter ? <IconGreatCounter /> : <IconGreat />;
      case 'REACTION_3':
        return asCounter ? <IconCongratsCounter /> : <IconCongrats />;
      case 'REACTION_4':
        return asCounter ? <IconInterestingCounter /> : <IconInteresting />;
      default:
        return <IconReaction />;
    }
  };

  /**
   * Get the i18n key for labelling a ReactionType.
   * @param reactionType type
   * @returns An i18n key
   */
  const getReactionLabel = (reactionType?: ReactionType | null) => {
    switch (reactionType) {
      case 'REACTION_1':
        return 'audience.reaction.thanks';
      case 'REACTION_2':
        return 'audience.reaction.great';
      case 'REACTION_3':
        return 'audience.reaction.congrats';
      case 'REACTION_4':
        return 'audience.reaction.interesting';
      default:
        return 'audience.reaction.default';
    }
  };

  return { getReactionIcon, getReactionLabel };
}
