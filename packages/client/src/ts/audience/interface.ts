import { UserProfile } from '../session/interfaces';

export interface IAudienceService {
  readonly views: IViewsService;
  readonly reactions: IReactionsService;
}

export interface IViewsService {
  /**
   * Load the views counter for a list of resources.
   * @param resourceIds list of resource ids
   * @returns map of counters, indexed by resource id.
   */
  getCounters(resourceIds: string[]): Promise<ViewsCounters>;
  /**
   * Load the views details for a resource.
   * @param resourceId ID of the resource
   * @returns detailed views counters, or `undefined` if an error occured.
   */
  getDetails(resourceId: string): Promise<ViewsDetails | undefined>;
  /**
   * Trigger a view for a resource.
   * @param resourceId id
   */
  trigger(resourceId: string): Promise<void>;
}

/**
 * ViewsCounters model
 */
export type ViewsCounters = {
  [resourceId: string]: number;
};

/**
 * Views details
 */
export interface ViewsDetails {
  viewsCounter: number;
  uniqueViewsCounter: number;
  uniqueViewsPerProfile?: ViewsDetailsProfile[];
}

/**
 * Views details
 */
export interface ViewsDetailsProfile {
  profile: UserProfile[number];
  counter: number;
}

export interface IReactionsService {
  /**
   * Load the list of available reactions types, which is configured on the platform.
   * @return a list of types, or undefined if an error occured.
   */
  loadAvailableReactions(): Promise<ReactionType[] | undefined>;
  /**
   * Load the reactions summary for a list of resources.
   * @param resourceIds list of resource ids
   * @returns map of summaries, indexed by resource id.
   */
  loadReactionSummaries(resourceIds: string[]): Promise<{
    [resourceId: string]: ReactionSummaryData | undefined;
  }>;
  /**
   * Load the reactions details for a resource.
   * @param resourceId ID of the resource
   * @param page Page number
   * @param size Number of results per page.
   */
  loadReactionDetails(
    resourceId: string,
    page: number,
    size: number,
  ): Promise<ReactionDetailsData | undefined>;
  /**
   * Remove the current user reaction to a resource.
   * @param resourceId id
   */
  deleteReaction(resourceId: string): Promise<void>;
  /**
   * Change the current user reaction to a resource.
   * @param resourceId id
   * @param reactionType reaction to set
   */
  updateReaction(resourceId: string, reactionType: ReactionType): Promise<void>;
  /**
   * Set the current user reaction to a resource.
   * @param resourceId id
   * @param reactionType reaction to set
   */
  createReaction(resourceId: string, reactionType: ReactionType): Promise<void>;
}

/** Typing of a Reaction */
export const ReactionTypes = [
  'REACTION_1',
  'REACTION_2',
  'REACTION_3',
  'REACTION_4',
] as const;
export type ReactionType = (typeof ReactionTypes)[number];

/** Typing of a Reaction summary */
export type ReactionSummaryData = {
  reactionTypes?: Array<ReactionType> | null;
  userReaction?: ReactionType | null;
  totalReactionsCounter: number;
};

/** Typing of a Reaction details */
export type ReactionDetailsData = {
  reactionCounters: {
    countByType: {
      [type in ReactionType]?: number;
    };
    allReactionsCounter: number;
  };
  userReactions: Array<{
    userId: string;
    profile: 'Teacher' | 'Student' | 'Relative' | 'Personnel';
    reactionType: ReactionType;
    displayName: string;
  }>;
};
