import {
  Congrats,
  CongratsCounter,
  Great,
  GreatCounter,
  Interesting,
  InterestingCounter,
  Thanks,
  ThanksCounter,
} from '@edifice.io/icons/audience';

import { ReactionType } from '@edifice.io/ts-client';
import { Reaction as ReactionIcon } from '../../../../../icons/dist';

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
        return asCounter ? <ThanksCounter /> : <Thanks />;
      case 'REACTION_2':
        return asCounter ? <GreatCounter /> : <Great />;
      case 'REACTION_3':
        return asCounter ? <CongratsCounter /> : <Congrats />;
      case 'REACTION_4':
        return asCounter ? <InterestingCounter /> : <Interesting />;
      default:
        return <ReactionIcon />;
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
