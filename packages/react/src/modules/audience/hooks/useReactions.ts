import { ERROR_CODE, odeServices, ReactionType } from '@edifice.io/client';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * This hook implements some logic and provides functions to easily call "audience" backend endpoints.
 * @param module application code, e.g. "blog"
 * @param resourceType type of resource, e.g. "post"
 * @returns functions to easily call "audience" backend endpoints
 */
export default function useReactions(module: string, resourceType: string) {
  const { reactions } = useRef(
    odeServices.audience(module, resourceType),
  ).current;
  const [availableReactions, setAvailableReactions] = useState<ReactionType[]>(
    [],
  );

  /** Load available reactions types. */
  async function loadAvailableReactions() {
    const results = await reactions.loadAvailableReactions();
    if (results) {
      setAvailableReactions(results);
    }
  }

  /**
   * Load the reactions summary for a list of resources.
   * @param resourceIds list of resource ids
   * @returns map of summaries, indexed by resource id.
   */
  async function loadReactionSummaries(resourceIds: string[]) {
    return await reactions.loadReactionSummaries(resourceIds);
  }

  /**
   * Load the reactions details for a resource.
   * @param resourceId ID of the resource
   * @param page Page number
   * @param size Number of results per page.
   */
  const loadReactionDetails = async (
    resourceId: string,
    page: number,
    size = 30,
  ) => {
    return await reactions.loadReactionDetails(resourceId, page, size);
  };

  /**
   * Set, update or remove a reaction to a resource.
   * @param resourceId id
   * @param newReaction reaction to set / update / remove
   * @param oldReaction Previous reaction, or null if none exists.
   * @returns a promise of "+" (reaction added), "-" (reaction removed) or "=" (reaction changed)
   */
  const applyReaction = useCallback(
    async (
      resourceId: string,
      newReaction: ReactionType,
      oldReaction: ReactionType | null,
    ) => {
      // Forbid setting an unavailable reaction, but allow resetting it.
      if (
        newReaction !== oldReaction &&
        availableReactions.indexOf(newReaction) < 0
      ) {
        return Promise.reject(ERROR_CODE.MALFORMED_DATA);
      }

      let result: '+' | '-' | '=' = '+';
      if (oldReaction) {
        if (newReaction === oldReaction) {
          // Reset the reaction
          await reactions.deleteReaction(resourceId);
          result = '-';
        } else {
          // Change reaction
          await reactions.updateReaction(resourceId, newReaction);
          result = '=';
        }
      } else {
        // Post a new reaction
        await reactions.createReaction(resourceId, newReaction);
      }
      if (odeServices.http().isResponseError())
        return Promise.reject(ERROR_CODE.UNKNOWN);
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [availableReactions],
  );

  /** Get the available reactions, only once. */
  useEffect(() => {
    loadAvailableReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    availableReactions,
    loadReactionDetails,
    loadReactionSummaries,
    applyReaction,
  };
}
