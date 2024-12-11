import { IOdeServices } from '../services/OdeServices';
import {
  IReactionsService,
  ReactionDetailsData,
  ReactionSummaryData,
  ReactionType,
} from './interface';

type ReactionAvailableData = {
  'reaction-types': ReactionType[];
};

export type ReactionSummariesData = {
  reactionsByResource: {
    [resourceId: string]: ReactionSummaryData | undefined;
  };
};

export class ReactionsService implements IReactionsService {
  constructor(
    private context: IOdeServices,
    private module: string,
    private resourceType: string,
  ) {}

  private get http() {
    return this.context.http();
  }

  async loadAvailableReactions() {
    try {
      const { 'reaction-types': reactions } = await this.context
        .conf()
        .getPublicConf<ReactionAvailableData>('audience');
      return Array.isArray(reactions) ? reactions : undefined;
    } catch (e) {
      console.error('Audience configuration not found');
      return undefined;
    }
  }

  async loadReactionSummaries(resourceIds: string[]) {
    const summaries = await this.http.get<ReactionSummariesData>(
      `/audience/reactions/${this.module}/${
        this.resourceType
      }?resourceIds=${resourceIds.join(',')}`,
    );
    return this.http.isResponseError() ? {} : summaries.reactionsByResource;
  }

  async loadReactionDetails(resourceId: string, page: number, size: number) {
    const details = await this.http.get<ReactionDetailsData>(
      `/audience/reactions/${this.module}/${this.resourceType}/${resourceId}?page=${page}&size=${size}`,
    );
    return this.http.isResponseError() ? undefined : details;
  }

  async deleteReaction(resourceId: string) {
    await this.http.delete<void>(
      `/audience/reactions/${this.module}/${this.resourceType}/${resourceId}`,
    );
  }

  async updateReaction(resourceId: string, reactionType: ReactionType) {
    await this.http.putJson<void>(
      `/audience/reactions/${this.module}/${this.resourceType}`,
      {
        resourceId,
        reactionType,
      },
    );
  }
  async createReaction(resourceId: string, reactionType: ReactionType) {
    await this.http.postJson<void>(
      `/audience/reactions/${this.module}/${this.resourceType}`,
      {
        resourceId,
        reactionType,
      },
    );
  }
}
