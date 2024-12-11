import { ResourceType, App } from '..';
import { IOdeServices } from '../services/OdeServices';

export class ServiceRegistry<T> extends Map<
  string,
  (context: IOdeServices) => T
> {
  /** Register a service */
  register(
    {
      application,
      resourceType,
    }: { application: App | string; resourceType: ResourceType },
    service: (context: IOdeServices) => T,
  ) {
    this.set(`${application}:main`, service);
    this.set(`${application}:${resourceType}`, service);
  }

  /** Lookup for a service */
  findService(
    lookFor: { application: App | string; resourceType: ResourceType },
    context: IOdeServices,
  ): T {
    return this.lookupService(lookFor, context);
  }

  /** Lookup for a main service */
  findMainService(
    { application }: { application: App | string },
    context: IOdeServices,
  ): T {
    return this.lookupService({ application, resourceType: 'main' }, context);
  }

  /** Check if a service is registered. */
  isRegistered({
    application,
    resourceType,
  }: {
    application: App | string;
    resourceType: ResourceType | 'main';
  }): boolean {
    const found = this.get(`${application}:${resourceType}`);
    return found !== undefined;
  }

  /** Private lookup for a service */
  private lookupService(
    {
      application,
      resourceType,
    }: { application: App | string; resourceType: ResourceType | 'main' },
    context: IOdeServices,
  ): T {
    const found = this.get(`${application}:${resourceType}`);
    if (found === undefined) {
      throw 'Service not found: ' + `${application}:${resourceType}`;
    }
    return found(context);
  }
}
