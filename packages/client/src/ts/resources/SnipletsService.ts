import { App, ERROR_CODE, ResourceType } from '../globals';
import { IOdeServices } from '../services/OdeServices';
import { ServiceRegistry } from './ServiceRegistry';
import { AbstractBehaviourService } from './behaviours/AbstractBehaviourService';
import { ActualitesBehaviour } from './behaviours/ActualitesBehaviour';
import { BlogBehaviour } from './behaviours/BlogBehaviour';
import { CollaborativewallBehaviour } from './behaviours/CollaborativewallBehaviour';
import { CommunityBehaviour } from './behaviours/CommunityBehaviour';
import { ExercizerBehaviour } from './behaviours/ExercizerBehaviour';
import { FormulaireBehaviour } from './behaviours/FormulaireBehaviour';
import { ForumBehaviour } from './behaviours/ForumBehaviour';
import { HomeworksBehaviour } from './behaviours/HomeworksBehaviour';
import { MagnetoBehaviour } from './behaviours/MagnetoBehaviour';
import { MindmapBehaviour } from './behaviours/MindmapBehaviour';
import { PagesBehaviour } from './behaviours/PagesBehaviour';
import { PollBehaviour } from './behaviours/PollBehaviour';
import { ScrapbookBehaviour } from './behaviours/ScrapbookBehaviour';
import { TimelinegeneratorBehaviour } from './behaviours/TimelinegeneratorBehaviour';
import { WikiBehaviour } from './behaviours/WikiBehaviour';
import { WorkspaceBehaviour } from './behaviours/WorkspaceBehaviour';
import { IBehaviourService } from './interface';

export class SnipletsService {
  //
  // STATIC REGISTRY
  //
  private static registry = new ServiceRegistry<IBehaviourService>();
  // Expose some useful functions
  static findBehaviour = this.registry.findService.bind(this.registry);
  static hasBehaviour = this.registry.isRegistered.bind(this.registry);

  static resourceProducingApps: App[] = [];

  static async initialize(
    context: IOdeServices,
    currentApp: App,
  ): Promise<App[]> {
    const http = context.http();

    // Don't wrap in a new Promise since we're already using async/await
    if (!this.resourceProducingApps.length) {
      // Default to current app and workspace
      this.resourceProducingApps = [currentApp, 'workspace'];

      try {
        const [appList, user] = await Promise.all([
          http.get<App[]>('/resources-applications'),
          context.session().getUser(),
        ]);

        if (user?.apps && appList?.length) {
          // Sanitize list against authorized apps for this user
          this.resourceProducingApps = appList.filter((appPrefix) =>
            user.apps.some((webapp) => webapp.address.includes(appPrefix)),
          );
        }
      } catch (error) {
        console.warn('Failed to load resource-producing apps:', error);
        // Keep default apps array
      }
    }

    return this.resourceProducingApps;
  }

  static registerCustomBehaviour(
    application: App,
    resourceType: ResourceType,
    service: (context: IOdeServices) => IBehaviourService,
  ): void {
    // Register a custom behaviour service for a specific resource type
    this.registry.register({ application, resourceType }, service);
  }

  static async registerBehaviours(currentApp: App): Promise<void> {
    // Register services
    this.resourceProducingApps.forEach((app) => {
      const key = { application: currentApp, resourceType: app };
      this.registry.register(key, (context: IOdeServices) =>
        this.serviceFor(context, currentApp, app),
      );
    });
  }

  private static serviceFor(
    context: IOdeServices,
    application: App,
    resourceType: ResourceType,
  ) {
    let service: AbstractBehaviourService;
    switch (resourceType) {
      case 'timelinegenerator':
        service = new TimelinegeneratorBehaviour(context);
        break;
      case 'workspace':
        service = new WorkspaceBehaviour(context);
        break;
      case 'blog':
        service = new BlogBehaviour(context);
        break;
      case 'actualites':
        service = new ActualitesBehaviour(context);
        break;
      case 'wiki':
        service = new WikiBehaviour(context);
        break;
      case 'pages':
        service = new PagesBehaviour(context);
        break;
      case 'poll':
        service = new PollBehaviour(context);
        break;
      case 'community':
        service = new CommunityBehaviour(context);
        break;
      case 'mindmap':
        service = new MindmapBehaviour(context);
        break;
      case 'forum':
        service = new ForumBehaviour(context);
        break;
      case 'homeworks':
        service = new HomeworksBehaviour(context);
        break;
      case 'scrapbook':
        service = new ScrapbookBehaviour(context);
        break;
      case 'collaborativewall':
        service = new CollaborativewallBehaviour(context);
        break;
      case 'exercizer':
        service = new ExercizerBehaviour(context);
        break;
      case 'formulaire':
        service = new FormulaireBehaviour(context);
        break;
      case 'magneto':
        service = new MagnetoBehaviour(context);
        break;
      default:
        throw ERROR_CODE.NOT_SUPPORTED;
    }
    service.APP = application;
    return service;
  }
}
