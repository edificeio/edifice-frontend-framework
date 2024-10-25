import { useCallback, useEffect, useState } from "react";

import {
  App,
  GetContextParameters,
  odeServices,
  SnipletsService,
} from "edifice-ts-client";
/*
 * Augmented definition of a resource, until behaviours are dropped.
 * The path would otherwise be found by using `IWebResourceService.getViewUrl(resource)`
 */
import { ILinkedResource } from "edifice-ts-client";

import { useMockedData } from "../../utils";

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
  // Needed for storybook to mock calls to backend
  const mock = useMockedData();

  // Resources-producing applications the user can use
  const [resourceApplications, setResourceApplications] = useState<App[]>([]);

  // Init services, only once
  useEffect(() => {
    (async () => {
      try {
        await SnipletsService.initialize(odeServices, mock?.app || appCode);
      } catch (error) {
        if (mock?.app) {
          SnipletsService.resourceProducingApps = [mock?.app];
        } else {
          throw error;
        }
      }
      await SnipletsService.registerBehaviours(mock?.app || appCode);
      setResourceApplications(SnipletsService.resourceProducingApps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadResources = useCallback(
    async (filters: GetContextParameters) => {
      const [resourceType] = filters.types;
      // If mocked data is available, use it. Otherwise load from server.
      const payload = mock?.loadResources
        ? await mock?.loadResources?.(filters).then((results) =>
            results.map((r) => {
              // Generate random IDs to prevent infinite recursion
              return {
                ...r,
                _id: "" + Math.round(Math.random() * 9999),
              };
            }),
          )
        : await odeServices
            .behaviour(appCode, resourceType)
            .loadResources(filters);

      return payload;
    },
    [appCode, mock],
  );

  return { resourceApplications, loadResources } as {
    resourceApplications: Array<App>;
    loadResources: (
      filters: GetContextParameters,
    ) => Promise<ILinkedResource[]>;
  };
};
