import { IOdeServices } from '../services/OdeServices';
import { IViewsService, ViewsCounters, ViewsDetails } from './interface';

export class ViewsService implements IViewsService {
  constructor(
    private context: IOdeServices,
    private module: string,
    private resourceType: string,
  ) {}

  private get http() {
    return this.context.http();
  }

  async getCounters(resourceIds: string[]) {
    const result = await this.http.get<ViewsCounters>(
      `/audience/views/count/${this.module}/${
        this.resourceType
      }?resourceIds=${resourceIds.join(',')}`,
    );
    return this.http.isResponseError() ? {} : result;
  }

  async getDetails(resourceId: string) {
    const details = await this.http.get<ViewsDetails>(
      `/audience/views/details/${this.module}/${this.resourceType}/${resourceId}`,
    );
    return this.http.isResponseError() ? undefined : details;
  }

  trigger(resourceId: string) {
    return this.http.post<void>(
      `/audience/views/${this.module}/${this.resourceType}/${resourceId}`,
    );
  }
}
