import { useCallback, useEffect, useState } from 'react';

import {
  App,
  GetContextParameters,
  odeServices,
  SnipletsService,
} from '@edifice.io/client';
/*
 * Augmented definition of a resource, until behaviours are dropped.
 * The path would otherwise be found by using `IWebResourceService.getViewUrl(resource)`
 */
import { ILinkedResource } from '@edifice.io/client';

/**
 * A hook to search for resources produced by applications.
 *
 * @param appCode Currently running application.
 * @returns An object with 2 fields :
 *
 * `resourceApplications: Array<App>`
 * Resources-producing applications the user can use.
 *
 * `loadResources: (filters:GetContextParameters) => Promise<ILinkedResource[]>`
 * A search method with filters.
 *
 */
export const useResourceSearch = (appCode: App) => {
  // Resources-producing applications the user can use
  const [resourceApplications, setResourceApplications] = useState<App[]>([]);

  // Init services, only once
  useEffect(() => {
    (async () => {
      await SnipletsService.initialize(odeServices, appCode);
      await SnipletsService.registerBehaviours(appCode);
      setResourceApplications(SnipletsService.resourceProducingApps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadResources = useCallback(
    async (filters: GetContextParameters) => {
      const [resourceType] = filters.types;
      // If mocked data is available, use it. Otherwise load from server.
      const payload = await odeServices
        .behaviour(appCode, resourceType)
        .loadResources(filters);

      return payload;
    },
    [appCode],
  );

  return { resourceApplications, loadResources } as {
    resourceApplications: Array<App>;
    loadResources: (
      filters: GetContextParameters,
    ) => Promise<ILinkedResource[]>;
  };
};
