import { App, ResourceType } from '../globals';
import { IOdeServices } from '../services/OdeServices';
import { ReactionsService } from './ReactionsService';
import { ViewsService } from './ViewsService';
import { IAudienceService } from './interface';

export class AudienceService implements IAudienceService {
  constructor(
    private context: IOdeServices,
    private module: App,
    private resourceType: ResourceType,
  ) {}

  public get views() {
    return new ViewsService(this.context, this.module, this.resourceType);
  }

  public get reactions() {
    return new ReactionsService(this.context, this.module, this.resourceType);
  }
}
